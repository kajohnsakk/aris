import { Log } from './utils/Log'

const express = require('express');
const app = express();
const request = require('request');

const multer = require('multer');
const upload = multer();

const REST_PORT = process.env.WEBHOOK_PORT || 3111;
const PLATFORM_URL = `https://${process.env.INSTANCE_NAME}.convolab.ai`;

// for parsing application/json
app.use(express.json()); 

// for parsing multipart/form-data
app.use(upload.array()); 

app.post('/webhook', (req: any, res: any) => {
    Log.debug("Incoming request to webhook with data ", req.body);
    request.post(PLATFORM_URL + '/messagelogic/receiveWebhook', {
        form: {
            result: req.body
        }
    }, (error: any, response: any, body: any) => {
        if (error) {
            Log.error("Error while sending request to chatbot instance with ", error);
        }

        if (response) {
            Log.debug("Response from chatbot instance is ", response.body);
        }

        if (body) {
            Log.debug ("Sending request to chatbot instance with body ", body);
        }
    });
    res.end();
});

app.listen(REST_PORT, () => {
    Log.debug('Webhook service ready on port ' + REST_PORT);
});
