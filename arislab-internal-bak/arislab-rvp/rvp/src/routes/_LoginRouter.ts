const express = require('express');
const router = express.Router();
const log = require('../../utils/log');
import {SAMLService} from '../components/SAMLService';
import {Authenticator} from '../components/Authenticator';

if (process.env.SAML_LOGIN_URL) {
    SAMLService.getInstance().bindRouter(router);
}
else {
    router.get('/', (req: any, res: any) => {
        res.render('login', {title: 'ConvoLab Console - Login', version: process.env.VERSION});
        // const data:any = req.body.data;
    });
    router.post('/', (req: any, res: any) => {
        log.info('[Authenticate] Authenticating member id: ', req.body.email);
        Authenticator.getInstance().issueNewToken(req.body.email, req.body.password, res, false).then(()=>{
            res.json({result: 'success'});
        });
    });
}
module.exports = router;