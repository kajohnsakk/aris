export { };
import * as express from 'express';
import { Request, Response } from "express";
import { IGBPayAccount, GBPayAccount } from '../models/GBPayAccount';
import { ErrorObject } from '../ts-utils/ErrorObject';
import { Log } from '../ts-utils/Log';

const router = express.Router();
const timeUuid = require('time-uuid');

router.post('/new', (req: Request, res: Response) => {
    const id = timeUuid();
    let updateData: IGBPayAccount;
    let requestBody = req.body;

    requestBody['id'] = id;

    updateData = { ...requestBody };

    Log.debug('[GBPayAccountRouter] Creating new gbpay account with body: ', updateData);

    const updateObj = new GBPayAccount(updateData, id);
    res.send({ "_id": updateObj.getUuid() });
    res.end();
    return updateObj.update(updateData);
});

router.post('/update', (req: Request, res: Response) => {
    const id = req.query.id

    let updateData: IGBPayAccount;
    let requestBody = req.body;

    requestBody['id'] = id;

    updateData = { ...requestBody };

    Log.debug('[GBPayAccountRouter] Updating id ' + id + ' with body: ', updateData);

    res.sendStatus(200);
    res.end();

    const updateObj = new GBPayAccount(updateData, id);
    return updateObj.save();
});

router.get("/details", (req: Request, res: Response) => {
    const id = req.query.id;
    if (!id) {
        throw new ErrorObject("id is required", 400);
    } else {
        GBPayAccount.findById(id).then(resultFindByID => {
            res.send(resultFindByID);
            res.end();
        });
    }
});

router.get('/all', (req: Request, res: Response) => {
    GBPayAccount.findAll()
        .then((resultFindAll) => {
            res.send(resultFindAll);
            res.end();
        });
});

router.post('/findByToken', (req: Request, res: Response) => {
    const token = req.body.token;

    if (!token) {
        ErrorObject.BAD_REQUEST.send(res);
    } else {
        GBPayAccount.findByToken(token)
            .then((resultFindByToken) => {
                res.send(resultFindByToken);
                res.end();
            });
    }
});

router.post('/findByCustomFields', (req: Request, res: Response) => {
    let fieldList: Array<{ fieldName: string, fieldValue: string }> = req.body;

    if (!fieldList) {
        ErrorObject.BAD_REQUEST.send(res);
    } else {
        GBPayAccount.findByCustomFields(fieldList)
            .then((resultFindByCustomFields) => {
                res.send(resultFindByCustomFields);
                res.end();
            });
    }
});

module.exports = router;