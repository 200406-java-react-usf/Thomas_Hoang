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
        
        expect.hasAssertions();

        let mockWax = new Wax(1, 'productName', 'brand', 'category', 0.50, false, 1, "description");
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        let result = await sut.getAll();

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        let result = await sut.getAll();

        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to a Wax object when getById retrieves a record from data source', async () => {

        expect.hasAssertions();

        let mockWax = new Wax(1, 'productName', 'brand', 'category', 0.50, false, 1, "description");
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        let result = await sut.getById(1);

        expect(result).toBeTruthy();
        expect(result instanceof Wax).toBe(true);

    });

    test('should resolve to an invalid object when getById retrieves no record from data source', async () => {
        expect.hasAssertions();

        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        let result = await sut.getById(9996);

        expect(result).toBeTruthy();
        expect(result instanceof Wax).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('Should resolve to a User object when getWaxByUniqueKey retrieves a record given a valid unique key.', async () => {
        expect.hasAssertions();
        
        let mockWax = new Wax(1, 'productName', 'brand', 'category', 0.50, false, 1, "description");
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        let result = await sut.getWaxByUniqueKey('productName', 'un');

        expect(result).toBeTruthy();
        expect(result instanceof Wax).toBe(true);
    });

    test('should resolve to a wax object if save returns a valid wax', async () => {
        expect.hasAssertions();


        let mockWax1 = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        let mockWax2 = new Wax(2, 'product2', 'brand', 'category', 0.50, true, undefined, 'Blank Description');
        let mockWax3 = new Wax(3, 'product3', 'brand', 'category', 0.50, true, 4, undefined);

        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax1);
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax2);
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax3);

        let result1 = await sut.save(mockWax1);
        let result2 = await sut.save(mockWax2);
        let result3 = await sut.save(mockWax3);

        expect(result1).toBeTruthy();
        expect(result1 instanceof Wax).toBe(true);
        expect(result2).toBeTruthy();
        expect(result2 instanceof Wax).toBe(true);
        expect(result3).toBeTruthy();
        expect(result3 instanceof Wax).toBe(true);
    });



    test('should resolve to true if updates a valid id', async () => {
        expect.hasAssertions();

        let mockWax1 = new Wax(1, 'product', 'brand', 'category', 0.50, true, 5, 'Blank Description');
        let mockWax2 = new Wax(2, 'product2', 'brand', 'category', 0.50, true, undefined, 'Blank Description');
        let mockWax3 = new Wax(3, 'product3', 'brand', 'category', 0.50, true, 4, undefined);

        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax1);
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax2);
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax3);



        let result1 = await sut.update(mockWax1);
        let result2 = await sut.update(mockWax2);
        let result3 = await sut.update(mockWax3);

        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
        expect(result3).toBeTruthy();
    });

    test('Should resolve to true when deleteById deletes a valid wax ', async () => {
        expect.hasAssertions();
        
        let mockWax = new Wax(1, 'productName', 'brand', 'category', 0.50, false, 1, "description");
        (mockMapper.mapWaxResultSet as jest.Mock).mockReturnValue(mockWax);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });
});