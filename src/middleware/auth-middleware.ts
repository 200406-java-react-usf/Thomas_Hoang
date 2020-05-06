import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";
import { Principal } from "../dtos/principal";
import { UserRepository } from "../repos/user-repo"

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role === 'Admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}
