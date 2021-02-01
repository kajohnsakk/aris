import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface IVoteCustomer {
    userID: string,
    isVoted: Boolean,
    isVotedDesigner: Boolean,
    votedFor: string,
    votedForDesigner: string,
    createdAt: number,
}

export class VoteCustomer extends AbstractPersistentModel {
    public userID: string;
    public isVoted: Boolean;
    public isVotedDesigner: Boolean;
    public votedFor: string;
    public votedForDesigner: string;
    public createdAt: number;
    constructor(json: IVoteCustomer, userID?: string) {
        super(userID);
        this.userID = json.userID;
        this.isVoted = json.isVoted;
        this.isVotedDesigner = json.isVotedDesigner;
        this.votedFor = json.votedFor;
        this.votedForDesigner = json.votedForDesigner;
        this.createdAt = json.createdAt;
    }

    doUpdate(json: IVoteCustomer): boolean {
        return true;
    }

    private static readonly TYPE = "vote_customer";
    protected getType(): string {
        return VoteCustomer.TYPE;
    }

    public toJSON(): any {
        return {
            userID: this.userID,
            isVoted: this.isVoted,
            votedFor: this.votedFor,
            createdAt: this.createdAt,
            isVotedDesigner: this.isVotedDesigner,
            votedForDesigner: this.votedForDesigner
        }
    }

    public static getVoteCustomerDetails(userID: string) {
        return ElasticsearchClient.getInstance().get(this.TYPE, userID)
            .then((resultVoteCustomerDetails: any) => {
                Log.debug('resultCustomerDetails', resultVoteCustomerDetails);
                return new VoteCustomer(resultVoteCustomerDetails, resultVoteCustomerDetails['userID']);
            })
            .catch((err) => {
                Log.error('Error while getting customer details: ', err);
                throw err;
            });
    }

    public static checkCustomerExists(userID: string) {
        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "userID.keyword": userID } }
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultCheckVoteCustomerExists: any) => {
                Log.debug('resultCheckVoteCustomerExists', resultCheckVoteCustomerExists);
                if (resultCheckVoteCustomerExists && resultCheckVoteCustomerExists.length > 0) {
                    let result = resultCheckVoteCustomerExists.map((result: { [key: string]: any }) => {
                        return new VoteCustomer(result._source, result._id)
                    });
                    return { "exists": true, "result": result }
                } else {
                    return { "exists": false, "result": [] };
                }
            })
            .catch((err) => {
                Log.debug('Error while checking customer exists: ', err);
                throw err;
            });
    }

}