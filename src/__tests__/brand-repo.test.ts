import { BrandRepository } from '../repos/brand-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Brand } from '../models/brand';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapBrandResultSet: jest.fn()
    }
});

describe('brandRepo', () => {

    let sut = new BrandRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                brandName: 'BrandName'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapBrandResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of brand when getAll retrieves records from data source', async () => {
        
        expect.hasAssertions();

        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);

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

    test('should resolve to a brand object when getById retrieves a record from data source', async () => {

        expect.hasAssertions();

        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);

        let result = await sut.getById(1);

        expect(result).toBeTruthy();
        expect(result instanceof Brand).toBe(true);

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
        expect(result instanceof Brand).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('Should resolve to a Brand object when getBrandByUniqueKey retrieves a record given a valid unique key.', async () => {
        expect.hasAssertions();
        
        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);

        let result = await sut.getBrandByUniqueKey('brandName', 'brand');

        expect(result).toBeTruthy();
        expect(result instanceof Brand).toBe(true);
    });

    test('should resolve to a brand object if save returns a valid brand', async () => {
        expect.hasAssertions();

        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);

        let result = await sut.save(mockBrand);

        expect(result).toBeTruthy();
        expect(result instanceof Brand).toBe(true);
    });

    test('should resolve to true if updates a valid id', async () => {

        expect.hasAssertions();
        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);


        let result = await sut.update(mockBrand);

        expect(result).toBeTruthy();
    });

    test('Should resolve to true when deleteById deletes a valid brand ', async () => {
        expect.hasAssertions();
        
        let mockBrand = new Brand(1, 'brand');
        (mockMapper.mapBrandResultSet as jest.Mock).mockReturnValue(mockBrand);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });
});