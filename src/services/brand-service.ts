import { Brand } from "../models/brand";
import { BrandRepository } from "../repos/brand-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class BrandService {

    constructor(private brandRepo: BrandRepository) {
        this.brandRepo = brandRepo;
    }

    async getAllBrands(): Promise<Brand[]> {

        let brands = await this.brandRepo.getAll();

        if (brands.length == 0) {
            throw new ResourceNotFoundError();
        }

        return brands;

    }

    async getBrandById(id: number): Promise<Brand> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let brand = await this.brandRepo.getById(id);

        if (isEmptyObject(brand)) {
            throw new ResourceNotFoundError();
        }

        return brand;

    }

    async getBrandByUniqueKey(queryObj: any): Promise<Brand> {

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Brand))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a user by id, reuse the logic we already have
            if (key === 'id') {
                return await this.getBrandById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let brand = await this.brandRepo.getBrandByUniqueKey(key, val);

            if (isEmptyObject(brand)) {
                throw new ResourceNotFoundError();
            }

            return brand;

        } catch (e) {
            throw e;
        }
    }

    async addNewBrand(newBrand: Brand): Promise<Brand> {
        
        try {

            if (!isValidObject(newBrand, 'id')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let brandAddedYet = await this.isBrandAddedYet(newBrand.brandName);

            if (!brandAddedYet) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }

            const persistedBrand = await this.brandRepo.save(newBrand);

            return persistedBrand;

        } catch (e) {
            throw e
        }

    }

    async updateBrand(updatedBrand: Brand): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedBrand)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            // let repo handle some of the other checking since we are still mocking db
            return await this.brandRepo.update(updatedBrand);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            throw new NotImplementedError();
        } catch (e) {
            throw e;
        }

    }

    private async isBrandAddedYet(brandName: string): Promise<boolean> {

        try {
            await this.getBrandByUniqueKey({'brand_name': brandName});
        } catch (e) {
            console.log('Brand is not added yet.')
            return true;
        }

        console.log('Brand is already in the database.')
        return false;

    }
}