export { };

import { Log } from '../ts-utils/Log';

import { JSONData as ChatbotJSON, Chatbot } from '../models/Chatbot';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/storeID/:storeID/details', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    Chatbot.findByStoreID(storeID).then((resultFindByStoreID) => {
        res.send(resultFindByStoreID);
        res.end();
    })
});

router.post('/storeID/:storeID/update', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let requestBody = req.body;
    let updateData: ChatbotJSON;

    if (requestBody.hasOwnProperty('config')) {
        updateData = {
            storeID: storeID,
            config: requestBody['config']
        }

        res.end()

        let updateObj = new Chatbot(updateData);
        return updateObj.update(updateData);
    } else {
        res.sendStatus(500);
        res.send('Invalid request body');
    }
});

module.exports = router;