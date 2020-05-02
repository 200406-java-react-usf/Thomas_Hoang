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

        let wax = await this.waxRepo.getByID(id);

        if (isEmptyObject(wax)) {
            throw new ResourceNotFoundError();
        }

        return wax
    }

}