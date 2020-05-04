import { WaxService } from '../services/wax-service';
import { WaxRepository } from '../repos/wax-repo';
import { Wax } from '../models/wax';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

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

    test('should resolve to Wax[] when getAllWaxes() successfully retrieves wax from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockWaxes);

        // Act
        let result = await sut.getAllWaxes();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(3);

    });

    test('should reject with ResourceNotFoundError when getAllWaxes fails to get any waxes from the data source', async () => {

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

    test('should resolve to Wax when getWaxById is given a valid an known id', async () => {

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

    test('should reject with BadRequestError when getWaxByID is given a invalid value as an id (NaN)', async () => {

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

    test('should reject with BadRequestError when getWaxByID is given a invalid value as an id (negative)', async () => {

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

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getWaxByID(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

});