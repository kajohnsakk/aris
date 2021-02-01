import * as express from 'express'
import {Express} from "express";
import {Log} from "../utils/Log";

const exphbs  = require('express-handlebars');
const path = require('path');
// require('dotenv').config({
//     path: '../../../.env'
// });
export class WebServer{
    private app : Express;
    constructor(){
        this.app = express();
        this.app.set('views', path.join(__dirname,'..', '/views'));

        this.app.use('/events', require("../routes/EventRouter"));

        this.app.engine('handlebars', exphbs({
            // defaultLayout: 'mask',
            defaultLayout: 'vertical-overlay',
            layoutsDir: 'media/views/',
            helpers: {
                numberToString: function (number : number) { return number.toLocaleString(); }
            }
        }));
        this.app.set('view engine', 'handlebars');

        this.app.use('/static', express.static(path.join(__dirname,'..', 'public')));
    }
    start(){
        const server = this.app.listen(process.env.WEB_PORT || 4080, function () {
            Log.debug('Web Server Listening at http://%s:%s', server.address());
            // Log.debug('Web server starting with env ', process.env)
        });
    }
}