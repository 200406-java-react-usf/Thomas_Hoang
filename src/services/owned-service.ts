import { Owned } from "../models/owned";
import { OwnedRepository } from "../repos/owned-repo";
import { WaxRepository } from "../repos/wax-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError,
    ResourceNotFoundError,
    ResourcePersistenceError
} from "../errors/errors";

export class OwnedService {
    constructor(private ownedRepo: OwnedRepository) {
        this.ownedRepo = ownedRepo;
    }
    async getAllWaxes(): Promise<Owned[]> {
        let waxes = await this.ownedRepo.getAll();
        if (waxes.length == 0) {
            throw new ResourceNotFoundError();
        }
        return waxes;
    }
    async getWaxByID(id: number): Promise<Owned> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }
        let wax = await this.ownedRepo.getById(id);
        if (isEmptyObject(wax)) {
            throw new ResourceNotFoundError();
        }
        return wax;
    }
    async getWaxByUniqueKey(queryObj: any): Promise<Owned> {
        try {
            let queryKeys = Object.keys(queryObj);
            if (!queryKeys.every(key => isPropertyOf(key, Owned))) {
                throw new BadRequestError();
            }
            let key = queryKeys[0];
            let val = queryObj[key];
            if (key === 'id') {
                return await this.getWaxByID(+val);
            }
            if (!isValidStrings(val)) {
                throw new BadRequestError();
            }
            let wax = await this.ownedRepo.getWaxByUniqueKey(key, val);
            if (isEmptyObject(wax)) {
                throw new ResourceNotFoundError();
            }
            return wax;
        }
        catch (e) {
            throw e;
        }
    }
    async addNewWax(newWax: Owned): Promise<Owned> {
        try {
            if (!isValidObject(newWax, 'id')) {
                throw new BadRequestError('Invalid property values found in provided wax.');
            }
            let waxAvailable = await this.isWaxAddedYet(newWax.user_id, newWax.wax_id);
            if (!waxAvailable) {
                throw new ResourcePersistenceError('The provided wax is already in the database.');
            }
            const persistedWax = await this.ownedRepo.save(newWax);
            return persistedWax;
        }
        catch (e) {
            throw e;
        }
    }
    async updateWax(updatedWax: Owned): Promise<boolean> {
        try {
            if (!isValidObject(updatedWax)) {
                throw new BadRequestError('Invalid wax provided (invalid values found).');
            }
            return await this.ownedRepo.update(updatedWax);
        }
        catch (e) {
            throw e;
        }
    }
    async deleteByID(id: number): Promise<boolean> {
        try {
            if (!isValidId(id))
                throw new BadRequestError();
            return await this.ownedRepo.deleteById(id);
        }
        catch (e) {
            throw e;
        }
    }
    async isWaxAddedYet(user_id: number, product_id: number): Promise<boolean> {
        try {
            await this.getWaxByUniqueKey({ 'user_id': user_id }) && this.getWaxByUniqueKey({ 'product_id': product_id });
        }
        catch (e) {
            console.log('Wax is not added yet.');
            return true;
        }
        console.log('Wax is added already.');
        return false;
    }
}
