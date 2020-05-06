import { OwnedService } from '../services/owned-service';
import { OwnedRepository } from '../repos/owned-repo';
import { Owned } from '../models/owned';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError , ResourcePersistenceError, AuthenticationError} from '../errors/errors';

jest.mock('../repos/owned-repo', () => {
    
    return new class OwnedRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getWaxByUniqueKey = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    }

});
describe('ownedService', () => {

    let sut: OwnedService;
    let mockRepo;

    let mockOwnedes = [
        //Tried each possible comibination of ownedes with nullable props
        new Owned(1, 1, 'productName1', 'brand', 'category', 0.50, false, 5, 5, 1, "description"),
        new Owned(2, 2, 'productName2', 'brand', 'category', 0.50, false, 5, undefined)
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAllWaxes: jest.fn(),
                getById: jest.fn(),
                getWaxByUniqueKey: jest.fn(),
                getWaxByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new OwnedService(mockRepo);
    
    });


    test('should resolve to Owned[] when getAllWaxes() successfully retrieves ownedes from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockOwnedes);

        // Act
        let result = await sut.getAllWaxes();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);

    });

    test('should reject with ResourceNotFoundError when getAllOwnedes fails to get any Ownedes from the data source', async () => {

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

    test('should resolve to Owned when getOwnedById is given a valid known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Owned>((resolve) => resolve(mockOwnedes[id - 1]));
        });


        // Act
        let result = await sut.getWaxByID(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.wax_id).toBe(1);

    });

    test('should reject with BadRequestError when getOwnedById is given a invalid value as an id (decimal)', async () => {

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

    test('should reject with BadRequestError when getOwnedById is given a invalid value as an id (zero)', async () => {

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

    test('should reject with BadRequestError when getOwnedById is given a invalid value as an id (NaN)', async () => {

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

    test('should reject with BadRequestError when getOwnedById is given a invalid value as an id (negative)', async () => {

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

    test('should reject with ResourceNotFoundError if getOwnedByid is given an unknown id', async () => {
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

        let mockOwned1 = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        let productName = 'notARealOwned'
        mockRepo.getWaxByUniqueKey = jest.fn().mockReturnValue(true);

        try {
            await sut.getWaxByUniqueKey({'product_name': productName});
        } catch (e) {

            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should reject with BadRequestError if getByid is given an unknown field', async () => {

        expect.hasAssertions();
        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        mockRepo.getOwnedByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getWaxByUniqueKey({'notACorrectField': 'productName'});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to a owned when save() successfully persists a owned', async () => {
        expect.assertions(2);
        let mockOwned = new Owned(2, 7, 'productName', 'brand', 'category', 0.50, true, 5, 5, 1, "description");

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isWaxAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newUser: Owned) => {
            return new Promise<Owned>((resolve) => {
                mockOwnedes.push(newUser);
                resolve(newUser);
            });
        });

        let result = await sut.addNewWax(mockOwned);

        expect(result).toBeTruthy();
        expect(result.user_id).toBe(2);
    });

    test('should reject with BadRequestError() when save() when user has invalid field', async () => {
        expect.assertions(1);

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");

        Validator.isValidStrings = jest.fn().mockReturnValue(false);
        sut.isWaxAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newOwned: Owned) => {
            return new Promise<Owned>((resolve) => {
                mockOwnedes.push(newOwned);
                resolve(newOwned);
            });
        });


        try {

            await sut.addNewWax(mockOwned);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should resolve to a Owned when updating a wax successfully', async () => {
        expect.assertions(1);

        let mockOwned = new Owned(1, 1, 'productName1', 'brand', 'category', 0.50, true, 5, 5, 1, "description");

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockImplementation((owned : Owned) => {
            return new Promise<Owned>((resolve) => {
            mockOwnedes.push(owned)
            resolve(owned)
            });
        });

        let result = await sut.updateWax(mockOwned);

        expect(result).toBeTruthy();
    });


    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((owned : Owned) => {
            return new Promise<Owned>((resolve) => {
            mockOwnedes.push(owned)
            resolve(owned)
            });
        });

        try {

            await sut.updateWax(mockOwned);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((owned : Owned) => {
            return new Promise<Owned>((resolve) => {
            mockOwnedes.push(owned)
            resolve(owned)
            });
        });

        try {

            await sut.updateWax(mockOwned);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to true when given owned id is deleted', async () => {
        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockImplementation((owned : Owned) => {
            return new Promise<Owned>((resolve) => {
            mockOwnedes.push(owned)
            resolve(owned)
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

    test('should resolve to a true when owned is not added yet', async () => {
        expect.assertions(1);

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isOwnedAddedYet = jest.fn().mockImplementation((owned : Owned) => {
            return new Promise<Owned>((resolve) => {
            mockOwnedes.push(owned)
            resolve(owned)
            });
        });

        let result = await sut.isWaxAddedYet(mockOwned.user_id, mockOwned.wax_id);

        expect(result).toBeTruthy();
    });

});