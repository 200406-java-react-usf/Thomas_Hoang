import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const BrandRouter = express.Router();

const brandService = AppConfig.brandService;

BrandRouter.get('', async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await brandService.getBrandByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await brandService.getAllBrands();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

BrandRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await brandService.getBrandById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

BrandRouter.post('', adminGuard, async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /brands');
    console.log(req.body);
    try {
        let newUser = await brandService.addNewBrand(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

BrandRouter.put('', adminGuard, async (req, resp) => {

    console.log('PUT REQUEST RECEIVED AT /brands');
    console.log(req.body);
    try {
        let updatedUser = await brandService.updateBrand(req.body);
        return resp.status(201).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

BrandRouter.delete('', adminGuard, async (req, resp) => {

    console.log('DELETE REQUEST RECEIVED AT /brands');
    console.log(req.body);
    try {
        let deletedUser = await brandService.deleteById(req.body);
        return resp.status(201).json(deletedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});