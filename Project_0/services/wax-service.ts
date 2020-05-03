import { Wax } from "../models/wax";
import { WaxRepository } from "../repos/wax-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import {
    BadRequestError,
    ResourceNotFoundError,
    NotImplementedError,
    ResourcePersistenceError, 
    AuthenticationError
} from "../errors/errors";
import { UserService } from "./user-service";


export class WaxService {

    constructor(private waxRepo: WaxRepository) {
        this.waxRepo = waxRepo;
    }

    async getAllWaxes(): Promise<Wax[]> {

        let waxes = await this.waxRepo.getAll();

        if (waxes.length == 0) {
            throw new ResourceNotFoundError();
        }

        return waxes
    }

    async getWaxByID(id: number): Promise<Wax> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let wax = await this.waxRepo.getById(id);

        if (isEmptyObject(wax)) {
            throw new ResourceNotFoundError();
        }

        return wax
    }

    async getWaxByUniqueKey(queryObj: any): Promise<Wax> {

        try{

            let queryKeys = Object.keys(queryObj);

            if (!queryKeys.every(key => isPropertyOf(key, Wax))) {
                throw new BadRequestError();
            }

            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'id') {
                return await this.getWaxByID(+val)
            }

            if (!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let wax = await this.waxRepo.getWaxByUniqueKey(key, val);

            if (isEmptyObject(wax)) {
                throw new ResourceNotFoundError();
            }

            return wax
        } catch (e) {
            throw e;
        }
    }
    
    async addNewWax(newWax: Wax): Promise<Wax> {

        try {

            if (!isValidObject(newWax, 'id')) {
                throw new BadRequestError('Invalid property values found in provided wax.');
            }

            let waxAvailable = await this.isWaxAddedYet(newWax.productName, newWax.brandID);

            if (!waxAvailable) {
                throw new ResourcePersistenceError('The provided wax is already in the database.');
            }

            const persistedWax = await this.waxRepo.save(newWax);

            return persistedWax;
        } catch (e){
            throw e
        }
    }

    async updateWax(updatedWax: Wax) : Promise<boolean> {

        try {

            if (!isValidObject(updatedWax)){
                throw new BadRequestError('Invalid wax provided (invalid values found).');
            }

            return await this.waxRepo.update(updatedWax);
        }catch (e) {
            throw e;
        }
    }

    async deleteByID(id: number): Promise<boolean> {
        
        try{
            if (!isValidId(id))
            throw new BadRequestError();

            return await this.waxRepo.deleteById(id);
        }catch (e) {
            throw e;
        }
    }

    private async isWaxAddedYet(productName: string, brandID: number): Promise<boolean>{

        try {
            await this.getWaxByUniqueKey({'product_name': productName}) && this.getWaxByUniqueKey({'product_name': productName})
        }catch (e) {
            console.log('Wax is not added yet.')
            return true;
        }

        console.log('Wax is added already.')
        return false;
    }
}