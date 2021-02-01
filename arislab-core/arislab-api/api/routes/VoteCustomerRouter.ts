export { };
import * as express from "express";
import { Request, Response } from "express";
import { VoteCustomer, IVoteCustomer } from '../models/VoteCustomer';
import { ErrorObject } from '../ts-utils/ErrorObject';
import { Log } from '../ts-utils/Log';

const router = express.Router();

router.post('/new', (req: Request, res: Response) => {
    let data: IVoteCustomer = {
        userID : req.body.userID,
        createdAt: Date.now(),
        isVoted : false,
        votedFor : req.body.votedFor,
        isVotedDesigner: false,
        votedForDesigner: req.body.votedForDesigner
    }

    Log.debug('Creating new vote customer with body: ', data);

    let updateObj = new VoteCustomer(data, req.body.userID)
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(data);
});

router.post('/userID/:userID/', (req: Request, res: Response) => {
    let userID = req.params.userID;

    VoteCustomer.getVoteCustomerDetails(userID)
        .then((resultVoteCustomerDetails) => {
            if(!resultVoteCustomerDetails){
                throw new ErrorObject("can not find vote customer of userID"+ userID, 400);
            } else {
                res.send(resultVoteCustomerDetails);
                res.end();
            }
        });
});

router.post('/update', (req: Request, res: Response) => {
    let updateData: IVoteCustomer;
    let requestBody = req.body as IVoteCustomer;
    let userID = requestBody['userID'];

    updateData = { ...requestBody };

    Log.debug('Updating vote customer by userID ' + userID + ' with body: ', updateData);

    res.sendStatus(200);
    res.end();

    let updateObj = new VoteCustomer(updateData, userID);
    return updateObj.save();
});

router.post('/exists', (req: Request, res: Response) => {
    let userID = req.body.userID;

    if (!userID) {
        throw new ErrorObject("userID is required", 400);
    } else {
        VoteCustomer.checkCustomerExists(userID)
            .then((resultCheckVoteCustomerExists) => {
                res.send(resultCheckVoteCustomerExists);
                res.end();
            });
    }
});

module.exports = router