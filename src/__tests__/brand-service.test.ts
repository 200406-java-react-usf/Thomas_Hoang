import { BrandService } from '../services/brand-service';
import { BrandRepository } from '../repos/brand-repo';
import { Brand } from '../models/brand';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError , ResourcePersistenceError, AuthenticationError} from '../errors/errors';

jest.mock('../repos/brand-repo', () => {
    
    return new class BrandRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getBrandByUniqueKey = jest.fn();
            getWaxByCredentials = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    }

});
describe('waxService', () => {

    let sut: BrandService;
    let mockRepo;

    let mockBrands = [
        new Brand(1, 'brand1'),
        new Brand(2, 'brand2'),
        new Brand(3, 'brand3'),
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
        sut = new BrandService(mockRepo);
    
    });


    test('should resolve to Brand[] when getAll() successfully retrieves brands from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockBrands);

        // Act
        let result = await sut.getAllBrands();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should reject with ResourceNotFoundError when getAllBrands fails to get any brands from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllBrands();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Brand when getBrandById is given a valid known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Brand>((resolve) => resolve(mockBrands[id - 1]));
        });


        // Act
        let result = await sut.getBrandById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);

    });

    test('should reject with BadRequestError when getBrandById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getBrandById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getBrandById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getBrandById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getBrandById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getBrandById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getBrqandById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getBrandById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getBrandById is given an unknown id', async () => {
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        try {
            await sut.getBrandById(9999);
        } catch (e) {

            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should reject with ResourceNotFoundError if getBrandByUniqueKey is given an unknown product', async () => {
        expect.hasAssertions();

        let mockBrands = new Brand(1, 'brand1')
        let brandName = 'notARealBrand'
        mockRepo.getBrandByUniqueKey = jest.fn().mockReturnValue(true);

        try {
            await sut.getBrandByUniqueKey({'brandName': brandName});
        } catch (e) {

            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
    });

    test('should reject with BadRequestError if getBrandByUniqueKey is given an unknown field', async () => {

        expect.hasAssertions();
        let mockBrand = new Brand(1, 'brand1')
        let username = 'notARealUser'
        mockRepo.getWaxByUniqueKey = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getBrandByUniqueKey({'notACorrectField': username});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to a wax when save() successfully persists a brand', async () => {
        expect.assertions(2);

        let mockBrand = new Brand(1, 'brand')

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isBrandAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newBrand: Brand) => {
            return new Promise<Brand>((resolve) => {
                mockBrands.push(newBrand);
                resolve(newBrand);
            });
        });

        let result = await sut.addNewBrand(mockBrand);

        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
    });

    test('should reject with ResourcePersistenceError if save is given an invalid name', async () => {
        expect.hasAssertions();

        let mockWax1 = new Brand(1, 'brand1')
        mockRepo.getUserByUniqueKey = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        sut.isBrandAddedYet = jest.fn().mockReturnValue(false);
        mockRepo.save = jest.fn().mockImplementation((newBrand: Brand) => {
            return new Promise<Brand>((resolve) => {
                mockBrands.push(newBrand);
                resolve(newBrand);
            });
        });

        try {

            await sut.addNewBrand(mockWax1);
        } catch (e) {

            expect(e instanceof ResourcePersistenceError).toBe(true);
        }
    });

    test('should reject with BadRequestError() when save() when brand has invalid field', async () => {
        expect.assertions(1);

        let mockWax1 = new Brand(1, '')

        Validator.isValidStrings = jest.fn().mockReturnValue(false);
        sut.isBrandAddedYet = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newBrand: Brand) => {
            return new Promise<Brand>((resolve) => {
                mockBrands.push(newBrand);
                resolve(newBrand);
            });
        });


        try {

            await sut.addNewBrand(mockWax1);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should resolve to a Brand when updating a brand successfully', async () => {
        expect.assertions(1);

        let mockWax1 = new Brand(1, 'brand1')

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.update = jest.fn().mockImplementation((brand : Brand) => {
            return new Promise<Brand>((resolve) => {
            mockBrands.push(brand)
            resolve(brand)
            });
        });

        let result = await sut.updateBrand(mockWax1);

        expect(result).toBeTruthy();
    });

    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockBrand1 =  new Brand(0, 'brand1')

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((brand : Brand) => {
            return new Promise<Brand>((resolve) => {
            mockBrands.push(brand)
            resolve(brand)
            });
        });

        try {

            await sut.updateBrand(mockBrand1);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });


    test('should reject with BadRequestError when updating an invalid id', async () => {
        expect.hasAssertions();

        let mockBrand = new Brand(0, 'brand1')

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update = jest.fn().mockImplementation((brand : Brand) => {
            return new Promise<Brand>((resolve) => {
            mockBrands.push(brand)
            resolve(brand)
            });
        });

        try {

            await sut.updateBrand(mockBrand);
        } catch (e) {

            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to true when given brand id is deleted', async () => {
        expect.assertions(1);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.deleteById = jest.fn().mockImplementation((brand : Brand) => {
            return new Promise<Brand>((resolve) => {
            mockBrands.push(brand)
            resolve(brand)
            });
        });

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });

    test('should reject BadRequestError when given brand is invalid', async () => {
        expect.hasAssertions();

        Validator.isValidId = jest.fn().mockReturnValue(false);
        mockRepo.deleteById = jest.fn().mockReturnValue(true);

        try {
            await sut.deleteById(-1);
        } catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to a true when brand is not added yet', async () => {
        expect.assertions(1);

        let mockBrand = new Brand(1, 'brand');

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isWaxAddedYet = jest.fn().mockImplementation((wax : Brand) => {
            return new Promise<Brand>((resolve) => {
            mockBrands.push(wax)
            resolve(wax)
            });
        });

        let result = await sut.isBrandAddedYet(mockBrand.brandName);

        expect(result).toBeTruthy();
    });

});