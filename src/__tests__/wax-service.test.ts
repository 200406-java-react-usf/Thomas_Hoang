import { WaxService } from '../services/wax-service';
import { WaxRepository } from '../repos/wax-repo';
import { Wax } from '../models/wax';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError , ResourcePersistenceError, AuthenticationError} from '../errors/errors';

jest.mock('../repos/wax-repo', () => {
    
    return new class WaxRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getWaxByUniqueKey = jest.fn();
            getWaxByCredentials = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    }

});
describe('waxService', () => {

    let sut: WaxService;
    let mockRepo;

    let mockWaxes = [
        //Tried each possible comibination of waxes with nullable props
        new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description'),
        new Wax(2, 'product2', 'brand', 'category', 0.50, true, 5),
        new Wax(3, 'product3', 'brand', 'category', 0.50, true)
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getWaxByUniqueKey: jest.fn(),
                getWaxByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new WaxService(mockRepo);
    
    });


    test('should resolve to Wax[] when getAllWaxes() successfully retrieves waxes from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockWaxes);

        // Act
        let result = await sut.getAllWaxes();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should reject with ResourceNotFoundError when getAllWaxes fails to get any Waxes from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllWaxes();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Wax when getWaxById is given a valid known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Wax>((resolve) => resolve(mockWaxes[id - 1]));
        });


        // Act
        let result = await sut.getWaxByID(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.productID).toBe(1);

    });

    test('should reject with BadRequestError when getWaxById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getWaxByID(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getWaxById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getWaxByID(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getWaxById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getWaxByID(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getWaxById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getWaxByID(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getWaxByid is given an unknown id', async () => {
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        try {
            await sut.getWaxByID(9999);
        } catch (e) {

            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown product', async () => {
        expect.hasAssertions();

        let mockWax1 = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        let productName = 'notARealWax'
        mockRepo.getWaxByUniqueKey = jest.fn().mockReturnValue(true);

        try {
            await sut.getWaxByUniqueKey({'productName': productName});
        } catch (e) {

            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should reject with BadRequestError if getByid is given an unknown field', async () => {

        expect.hasAssertions();
        let mockWax1 = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        let username = 'notARealUser'
        mockRepo.getWaxByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getWaxByUniqueKey({'notACorrectField': username});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to a wax when save() successfully persists a wax', async () => {
        expect.assertions(2);

        let mockWax = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isWaxAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newUser: Wax) => {
            return new Promise<Wax>((resolve) => {
                mockWaxes.push(newUser);
                resolve(newUser);
            });
        });

        let result = await sut.addNewWax(mockWax);

        expect(result).toBeTruthy();
        expect(result.productID).toBe(1);
    });

    test('should reject with ResourcePersistenceError if save is given an invalid username', async () => {
        expect.hasAssertions();

        let mockWax1 = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        mockRepo.getUserByUniqueKey = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isWaxAddedYet = jest.fn().mockReturnValue(false);
        mockRepo.save = jest.fn().mockImplementation((newUser: Wax) => {
            return new Promise<Wax>((resolve) => {
                mockWaxes.push(newUser);
                resolve(newUser);
            });
        });

        try {

            await sut.addNewWax(mockWax1);
        } catch (e) {

            expect(e instanceof ResourcePersistenceError).toBe(true);
        }
    });

    test('should reject with BadRequestError() when save() when user has invalid field', async () => {
        expect.assertions(1);

        let mockWax1 = new Wax(1, 'product', '', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidStrings = jest.fn().mockReturnValue(false);
        sut.isWaxAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newWax: Wax) => {
            return new Promise<Wax>((resolve) => {
                mockWaxes.push(newWax);
                resolve(newWax);
            });
        });


        try {

            await sut.addNewWax(mockWax1);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should resolve to a Wax when updating a wax successfully', async () => {
        expect.assertions(1);

        let mockWax1 = new Wax(1, 'newProduct', 'brand', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockImplementation((wax : Wax) => {
            return new Promise<Wax>((resolve) => {
            mockWaxes.push(wax)
            resolve(wax)
            });
        });

        let result = await sut.updateWax(mockWax1);

        expect(result).toBeTruthy();
    });

    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockWax1 = new Wax(0, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((wax : Wax) => {
            return new Promise<Wax>((resolve) => {
            mockWaxes.push(wax)
            resolve(wax)
            });
        });

        try {

            await sut.updateWax(mockWax1);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockWax = new Wax(0, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((wax : Wax) => {
            return new Promise<Wax>((resolve) => {
            mockWaxes.push(wax)
            resolve(wax)
            });
        });

        try {

            await sut.updateWax(mockWax);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to true when given wax id is deleted', async () => {
        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockImplementation((wax : Wax) => {
            return new Promise<Wax>((resolve) => {
            mockWaxes.push(wax)
            resolve(wax)
            });
        });

        let result = await sut.deleteByID(1);

        expect(result).toBeTruthy();
    });

    test('should reject BadRequestError when given user is invalid', async () => {
        expect.hasAssertions();

        Validator.isValidId = jest.fn().mockReturnValue(false);
        mockRepo.deleteById = jest.fn().mockReturnValue(true);

        try {
            await sut.deleteByID(-1);
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to a true when wax is not added yet', async () => {
        expect.assertions(1);

        let mockWax1 = new Wax(1, 'newProduct', 'brand', 'category', 0.50, true, 5, 'Blank Description');

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isWaxAddedYet = jest.fn().mockImplementation((wax : Wax) => {
            return new Promise<Wax>((resolve) => {
            mockWaxes.push(wax)
            resolve(wax)
            });
        });

        let result = await sut.isWaxAddedYet(mockWax1.productName, mockWax1.brand);

        expect(result).toBeTruthy();
    });

});