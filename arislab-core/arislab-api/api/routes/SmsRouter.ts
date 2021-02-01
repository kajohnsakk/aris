export { };
import axios from 'axios';
// import { JSONData as ProductJSON, Product } from '../models/Product';
// import uuidv4 from 'uuid/v4';
import { Log } from '../ts-utils/Log';
import { ErrorObject } from '../ts-utils/ErrorObject';
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();
const timeUuid = require('time-uuid');


function changeToMobileNumber(phoneNo: string) {
    return phoneNo.replace(/^0/gi, "+66");
}

router.post('/send/message', (req: Request, res: Response) => {
    Log.debug('req body is ', req.body);

    var BULKSMS_URL = process.env.BULKSMS_URL || 'https://api.bulksms.com/v1/messages';
    var BULKSMS_USERNAME = process.env.BULKSMS_USERNAME || 'nattaponk';
    var BULKSMS_PASSWORD = process.env.BULKSMS_PASSWORD || '3edcCDE#';

    let to: string[] = [];
    var senderName = req.body.senderName;
    var mobileNumber: string = req.body.mobileNumber.replace(/-/g, "");
    var message: string = req.body.message;
    var authorize: string = Buffer.from(BULKSMS_USERNAME + ':' + BULKSMS_PASSWORD).toString('base64');

    var config = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authorize}`
        }
    };

    if( mobileNumber.search(",") ) {
        var mobileNumberList = mobileNumber.split(",");
        mobileNumberList.forEach((item: any, index: number) => {
            to.push(changeToMobileNumber(item.trim()));
        });
    } else {
        to.push(changeToMobileNumber(mobileNumber));
    }

    var data: any = {
        "to": to,
        "body": message
    };

    if ( senderName && senderName.length > 0 ) {
        data['from'] = senderName;
    }
    
    Log.debug('Send SMS to: ' + BULKSMS_URL + ' with data: ', data);
    axios.post(BULKSMS_URL, data, config).then((response) => {
        Log.debug('Result from sent SMS is ', response.data);
        res.send(response.data);
        res.end();
    }).catch(err => {
        throw err;
    });

});

router.post('/send/otp', (req: Request, res: Response) => {
    Log.debug('req body is ', req.body);

    var BULKSMS_URL = process.env.BULKSMS_URL || 'https://api.bulksms.com/v1/messages';
    var BULKSMS_USERNAME = process.env.BULKSMS_USERNAME || 'nattaponk';
    var BULKSMS_PASSWORD = process.env.BULKSMS_PASSWORD || '3edcCDE#';
    console.log('env ========>', BULKSMS_URL, BULKSMS_USERNAME, BULKSMS_PASSWORD)
    
    let to: string[] = [];
    var senderName = req.body.senderName;
    var mobileNumber: string = req.body.mobileNumber.replace(/-/g, "");
    var message: string = `Your OTP is ${req.body.otp} (ref: ${req.body.refOtp}). For security reasons, do not disclose this OTP with anyone.`;
    var authorize: string = Buffer.from(BULKSMS_USERNAME + ':' + BULKSMS_PASSWORD).toString('base64');

    var config = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authorize}`
        }
    };

    if( mobileNumber.search(",") ) {
        var mobileNumberList = mobileNumber.split(",");
        mobileNumberList.forEach((item: any, index: number) => {
            to.push(changeToMobileNumber(item.trim()));
        });
    } else {
        to.push(changeToMobileNumber(mobileNumber));
    }

    var data: any = {
        "to": to,
        "body": message
    };

    if ( senderName && senderName.length > 0 ) {
        data['from'] = senderName;
    }
    Log.debug(BULKSMS_URL, data, config);
    Log.debug('Send SMS to: ' + BULKSMS_URL + ' with data: ', data);
    axios.post(BULKSMS_URL, data, config).then((response) => {
        Log.debug('Result from sent SMS is ', response.data);
        res.send(response.data);
        res.end();
    }).catch(err => {
        throw err;
    });

});

module.exports = router;