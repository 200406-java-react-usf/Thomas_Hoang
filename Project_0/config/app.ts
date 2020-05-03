import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { WaxRepository } from "../repos/wax-repo";
import { WaxService } from "../services/wax-service";
import { OwnedRepository } from "../repos/owned-repo";
import { OwnedService } from "../services/owned-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const waxRepo = new WaxRepository();
const waxService = new WaxService(waxRepo);

const ownedRepo = new OwnedRepository();
const ownedService = new OwnedService(ownedRepo);

export default {
    userService,
    waxService,
    ownedService
}