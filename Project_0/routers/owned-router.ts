import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const OwnedRouter = express.Router();

const ownedService = AppConfig.ownedService;

OwnedRouter.get('/', async (req, resp) => {
    
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await ownedService.getWaxByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await ownedService.getAllWaxes();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});
OwnedRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id; // the plus sign is to type coerce id into a number
    try {
        let payload = await ownedService.getWaxByID(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(404).json(e).send();
    }
});

OwnedRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /owned');
    console.log(req.body);
    try {
        let newUser = await ownedService.addNewWax(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

OwnedRouter.put('', async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /owned');
    console.log(req.body);
    try {
        let updatedUser = await ownedService.updateWax(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

OwnedRouter.delete('', async (req, resp) => {

    console.log('DELETE REQUEST RECEIVED AT /owned');
    console.log(req.body);
    try {
        let deletedUser = await ownedService.deleteByID(req.body);
        return resp.status(201).json(deletedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});
