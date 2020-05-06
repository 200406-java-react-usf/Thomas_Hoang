import { OwnedRepository } from '../repos/owned-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Owned } from '../models/owned';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapOwnedResultSet: jest.fn()
    }
});

describe('ownedRepo', () => {

    let sut = new OwnedRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                userID: 1,
                                productID: 1,
                                productName: 'Lemon Basil',
                                brand: 'ScentSationals',
                                scentCategory: 'Perfumey',
                                productPrice: 0.50,
                                limitedEdition: true,
                                quantity: 5,
                                personalRating: 5,
                                scentStrength: 1,
                                scentDescription: 'Random Description'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapOwnedResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Ownedes when getAll retrieves records from data source', async () => {
        
        expect.hasAssertions();

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned);

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

    test('should resolve to a Owned object when getById retrieves a record from data source', async () => {

        expect.hasAssertions();

        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned);

        let result = await sut.getById(1);

        expect(result).toBeTruthy();
        expect(result instanceof Owned).toBe(true);

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
        expect(result instanceof Owned).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('Should resolve to a User object when getOwnedByUniqueKey retrieves a record given a valid unique key.', async () => {
        expect.hasAssertions();
        
        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned);

        let result = await sut.getWaxByUniqueKey('productName', 'productName');

        expect(result).toBeTruthy();
        expect(result instanceof Owned).toBe(true);
    });

    test('should resolve to a owned object if save returns a valid owned', async () => {
        expect.hasAssertions();


        let mockOwned1 = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        let mockOwned2 = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, undefined);

        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned1);
        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned2);

        let result1 = await sut.save(mockOwned1);
        let result2 = await sut.save(mockOwned2);

        expect(result1).toBeTruthy();
        expect(result1 instanceof Owned).toBe(true);
        expect(result2).toBeTruthy();
        expect(result2 instanceof Owned).toBe(true);
    });



    test('should resolve to true if updates a valid id', async () => {
        expect.hasAssertions();

        let mockOwned1 = new Owned(2, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");
        let mockOwned2 = new Owned(2, 1, 'productName', 'brand', 'category', 0.50, false, 5, undefined , undefined, undefined);

        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned1);
        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned2);

        let result1 = await sut.update(mockOwned1);
        let result2 = await sut.update(mockOwned2);

        expect(result1).toBeTruthy();
        expect(result2).toBeTruthy();
    });

    test('Should resolve to true when deleteById deletes a valid owned ', async () => {
        expect.hasAssertions();
        
        let mockOwned = new Owned(1, 1, 'productName', 'brand', 'category', 0.50, false, 5, 5, 1, "description");

        (mockMapper.mapOwnedResultSet as jest.Mock).mockReturnValue(mockOwned);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });
});