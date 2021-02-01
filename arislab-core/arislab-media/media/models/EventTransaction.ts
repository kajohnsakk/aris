import {ElasticsearchClient} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";

export interface IStreamingInfo {
    name: string,
    description: string,
    videoID: string,
    streamURL: string,
    status: string,
    detail: string,
    eventStartAt: number,
    eventEndAt: number,
    streamingToIpAddress: string,
    products: string[]
}

export interface IEventTransaction {
    eventTransactionID: string,
    eventID: string,
    storeID: string,
    code: string,
    streamingInfo: IStreamingInfo
}

export class EventTransaction extends AbstractPersistentModel {
    public eventTransactionID: string;
    public eventID: string;
    public storeID: string;
    public code: string;
    public streamingInfo: IStreamingInfo;

    constructor(json: IEventTransaction, eventTransactionID?: string) {
        super(eventTransactionID);
        this.eventTransactionID = eventTransactionID;
        if( json ) {
            this.eventID = json.eventID;
            this.storeID = json.storeID;
            this.code = json.code;
            this.streamingInfo = json.streamingInfo;
        }
    }

    doUpdate(json: IEventTransaction): boolean {
        return true;
    }

    private static readonly TYPE = "event_transaction";
    protected getType(): string {
        return EventTransaction.TYPE;
    }

    public toJSON(): IEventTransaction {
        return {
            eventTransactionID: this.eventTransactionID,
            eventID: this.eventID,
            storeID: this.storeID,
            code: this.code,
            streamingInfo: this.streamingInfo,
        }
    }

    public updateJSON(json: IEventTransaction) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.eventTransactionID = json.eventTransactionID;
                this.eventID = json.eventID;
                this.storeID = json.storeID;
                this.code = json.code;
                this.streamingInfo = json.streamingInfo;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

}
