export { };
import { Event, JSONData } from '../models/Event';
import uuidv4 from 'uuid/v4';
import { Log } from '../ts-utils/Log';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();
const timeUuid = require('time-uuid');

router.get('/storeID/:storeID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    Event.findStoreEventList(storeID).then((resultFindByID: JSONData[]) => {
        res.send(resultFindByID);
        res.end();
    });
});

router.get('/code/:code/', (req: Request, res: Response) => {
    let code = req.params.code;
    Event.findEventInfoFromCode(code).then((resultFindByEventCode: JSONData) => {
        res.send(resultFindByEventCode);
        res.end();
    });
});

router.get('/storeID/:storeID/eventID/:eventID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let eventID = req.params.eventID;
    Event.findEventInfo(storeID, eventID).then((resultFindByEventID: JSONData) => {
        res.send(resultFindByEventID);
        res.end();
    });
});

router.post('/storeID/:storeID/event/new/', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('req body is ', req.body);

    let storeID = req.params.storeID;
    let updateData: JSONData;
    let requestBody = req.body;

    let eventID = timeUuid();

    requestBody['eventID'] = eventID;
    requestBody['streamingToIpAddress'] = "";

    updateData = { ...requestBody };

    Log.debug('Creating new event with data: ', updateData);

    let updateObj = new Event(updateData, eventID);
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(updateData);
});

router.post('/storeID/:storeID/event/:eventID/update/', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('eventID is ', req.params.eventID);

    let storeID = req.params.storeID;
    let eventID = req.params.eventID;
    let updateData: JSONData;
    let requestBody = req.body;

    updateData = { ...requestBody };

    Log.debug('Updating eventID: ' + eventID + ' of storeID: ' + storeID + ' with data: ', updateData);
    res.send(200);
    res.end();

    let updateObj = new Event(updateData, eventID);
    updateObj.save();
});

router.post('/storeID/:storeID/event/:eventID/delete/', (req: Request, res: Response) => {
    Log.debug('eventID is ', req.params.eventID);

    let storeID = req.params.storeID;
    let eventID = req.params.eventID;
    let updateData: JSONData;

    Log.debug('Deleting eventID: ' + eventID);
    res.send(200);
    res.end();

    let updateObj = new Event(updateData, eventID);
    updateObj.delete();
});

module.exports = router;