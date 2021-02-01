import {ApiProxy} from "../components/ApiProxy";
const express = require('express');
const router = express.Router();
const log  = require("../../utils/log");
const Error = require("../../utils/error");
router.get('/', (req:any, res:any) => {
    if(req.cookies.token){
        const token = req.cookies.token;
        ApiProxy.getInstance().sendRequest('POST', '/tokens/'+token+"/invalidate").then(()=>{
            res.clearCookie("token");
            res.render('logout', { title: 'ConvoLab Console - Login', version:process.env.VERSION });
            // const data:any = req.body.data;
        });
    }
    else{
        res.render('logout', { title: 'ConvoLab Console - Login', version:process.env.VERSION });
    }

    if(process.env.SAML_LOGOUT_URL){
        res.redirect(process.env.SAML_LOGOUT_URL);
    }
});
module.exports = router;