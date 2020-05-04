import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { WaxRepository } from "../repos/wax-repo";
import { WaxService } from "../services/wax-service";
import { OwnedRepository } from "../repos/owned-repo";
import { OwnedService } from "../services/owned-service";
import { BrandRepository } from "../repos/brand-repo";
import { BrandService } from "../services/brand-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const waxRepo = new WaxRepository();
const waxService = new WaxService(waxRepo);

const ownedRepo = new OwnedRepository();
const ownedService = new OwnedService(ownedRepo);

const brandRepo = new BrandRepository();
const brandService = new BrandService(brandRepo);

export default {
    userService,
    waxService,
    ownedService,
    brandService
}