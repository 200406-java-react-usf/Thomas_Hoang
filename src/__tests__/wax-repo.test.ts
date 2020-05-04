import { WaxRepository } from '../repos/wax-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Wax } from '../models/wax';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapWaxResultSet: jest.fn()
    }
});

describe('waxRepo', () => {

    let sut = new WaxRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                productID: 1,
                                productName: 'Lemon Basil',
                                brand: 'ScentSationals',
                                scentCategory: 'Perfumey',
                                productPrice: 0.50,
                                limitedEdition: true,
                                scentStrength: 1,
                                scentDescription: 'Random Description'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapWaxResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Waxes when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockWax = new Wax(1, '', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Wax object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockWax = new Wax(1, '', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Wax).toBe(true);

    });

});
