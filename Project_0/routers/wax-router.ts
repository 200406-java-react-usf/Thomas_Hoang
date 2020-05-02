import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { WaxService } from '../services/wax-service';

export const WaxRouter = express.Router();

const waxService = AppConfig.waxService;

WaxRouter.get('/', async (req, resp) => {
    
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await WaxService.getWaxByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        }else {
            let payload = await WaxService.getAllWaxes();
            resp.statusMessage(200).json(payload);
        }
    };

WaxRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id; // the plus sign is to type coerce id into a number
    try {
        let payload = await waxService.getById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(404).json(e).send();
    }
});
