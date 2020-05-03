import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const WaxRouter = express.Router();

const waxService = AppConfig.waxService;

WaxRouter.get('/', async (req, resp) => {
    
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await waxService.getWaxByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await waxService.getAllWaxes();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

WaxRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id; // the plus sign is to type coerce id into a number
    try {
        let payload = await waxService.getWaxByID(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(404).json(e).send();
    }
});

WaxRouter.post('', adminGuard, async (req, resp) => {
    
    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let updatedUser = await waxService.addNewWax(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});
WaxRouter.put('', adminGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let updatedUser = await waxService.updateWax(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});
WaxRouter.delete('', adminGuard, async (req, resp) => {

    console.log('DELETE REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let updatedUser = await waxService.deleteByID(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});