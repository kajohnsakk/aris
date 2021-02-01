import {ApiProxy} from '../components/ApiProxy';

const express = require('express');
const router = express.Router();
import {ErrorObject} from '../utils/ErrorObject';
import {Log} from '../utils/Log';

router.get('/', (req: any, res: any) => {
    const token = req.query.token;
    if(!token)
        ErrorObject.BAD_REQUEST.send(res);
    else{
        ApiProxy.getInstance().sendRequest('POST', '/members/token', {
            token:token
        }).then((json)=>{
            if(json.token && res){
                let cookieOption: any = {httpOnly: true};
                if(process.env.NODE_ENV === 'production') cookieOption.secure = true;
                res.cookie('token', json.token, cookieOption);
                res.redirect('/platform');
            }
            else throw ErrorObject.INVALID_CREDENTIAL.send(res, 'Invalid token');
        }).catch((err)=>{
            Log.error(err.toString(), err.stack);
            if(err instanceof ErrorObject){
                err.send(res);
            }
            else
            // Send out error string - this could be change password error reasons
                ErrorObject.BAD_REQUEST.send(res, err.toString());
        });
    }
    // const data:any = req.body.data;
});
module.exports = router;