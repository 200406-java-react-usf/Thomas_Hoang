import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { WaxRepository } from "../repos/wax-repo";
import { WaxService } from "../services/wax-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const waxRepo = new WaxRepository();
const waxService = new WaxService(waxRepo);

export default {
    userService
}