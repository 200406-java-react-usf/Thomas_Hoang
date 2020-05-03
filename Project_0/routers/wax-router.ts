import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';

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
