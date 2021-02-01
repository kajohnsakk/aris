import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient, ElasticsearchQueryResultDocument } from '../components/ElasticsearchClient';
import { IOrder } from "./Order";

import { Log } from '../utils/Log';

export interface ISummaryInfo {
    subtotal: number,
    vatPercent: number,
    vat: number,
    total: number
}

export interface IDocumentData {
    index: number,
    description: string,
    amount: number,
    unitPrice: number,
    discountPercent: number,
    discount: number,
    price: number
}

export interface ICustomerInfo {
    name: string,
    address: string,
    taxID: string
}

export interface IInvoice {
    invoiceID: string,
    documentNumber: string,
    documentDate: string,
    invoiceFileUrl: string,
    orderFileUrl: string,
    isInvoice: boolean,
    customerInfo: ICustomerInfo,
    documentData: IDocumentData[],
    summaryInfo: ISummaryInfo,
    orders: IOrder[],
    createdAt: number,
    isDeleted: boolean,
    deletedAt: number,
}

export class Invoice extends AbstractPersistentModel {
    public invoiceID: string;
    public documentNumber: string;
    public documentDate: string;
    public invoiceFileUrl: string;
    public orderFileUrl: string;
    public isInvoice: boolean;
    public customerInfo: ICustomerInfo;
    public documentData: IDocumentData[];
    public summaryInfo: ISummaryInfo;
    public orders: IOrder[];
    public createdAt: number;
    public isDeleted: boolean;
    public deletedAt: number;

    constructor(json: IInvoice, invoiceID?: string) {
        super(invoiceID);
        this.invoiceID = invoiceID;
        this.documentNumber = json.documentNumber;
        this.documentDate = json.documentDate;
        this.invoiceFileUrl = json.invoiceFileUrl;
        this.orderFileUrl = json.orderFileUrl;
        this.isInvoice = json.isInvoice;
        this.customerInfo = json.customerInfo;
        this.documentData = json.documentData;
        this.summaryInfo = json.summaryInfo;
        this.orders = json.orders;
        this.createdAt = json.createdAt;
        this.isDeleted = json.isDeleted;
        this.deletedAt = json.deletedAt;
    }

    doUpdate(json: IInvoice): boolean {
        return true;
    }

    private static readonly TYPE = "invoice";
    protected getType(): string {
        return Invoice.TYPE;
    }

    public toJSON(): any {
        return {
            invoiceID: this.invoiceID,
            documentNumber: this.documentNumber,
            documentDate: this.documentDate,
            invoiceFileUrl: this.invoiceFileUrl,
            orderFileUrl: this.orderFileUrl,
            isInvoice: this.isInvoice,
            customerInfo: this.customerInfo,
            documentData: this.documentData,
            summaryInfo: this.summaryInfo,
            orders: this.orders,
            createdAt: this.createdAt,
            isDeleted: this.isDeleted,
            deletedAt: this.deletedAt
        };
    }

    public static getAllInvoice(): Promise<Invoice[]> {
        
        let searchQuery = {
            query: {
                bool: {
                    must: [
                        { match: { "isDeleted": false } }
                    ]
                }
            },
            sort: [
                {
                    "createdAt": {
                        "order": "desc"
                    }
                }
            ]
        };

        Log.debug('[Invoice] Finding invoice with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[Invoice] Result find invoice by id: ", json);
                    return json.map((result: any) => {
                        return new Invoice(result._source, result._id);
                    });
                } else {
                    return [];
                }
            });
    }

    public static findById(invoiceID: string): Promise<Invoice> {
        
        let searchQuery = {
            query: {
                bool: {
                    must: [
                        { match: { "invoiceID.keyword": invoiceID } }
                    ]
                }
            }
        };

        Log.debug('[Invoice] Finding invoice by id with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[Invoice] Result find invoice by id: ", json);
                    return json.map((result: any) => {
                        return new Invoice(result._source, result._id);
                    });
                } else {
                    return [];
                }
            });
    }

    public static findByDate(startDate: Number, endDate: Number): Promise<Array<Invoice>> {
        
        let filter = {};

        if( startDate > 0 && endDate > 0 ) {
            filter = {
                range: { 'createdAt': { gte: startDate, lte: endDate } } 
            };
        }
        
        let searchQuery = {
            query: {
                bool: {
                    must: [
                        { match: { isDeleted: false } }
                    ],
                    filter
                }
            },
            sort: [
                {
                    orderDate: {
                        'order': 'desc'
                    }
                }
            ]
        };

        Log.debug('[Invoice] Finding invoice by date with query: ', searchQuery);

        return ElasticsearchClient.getInstance()
            .search(this.TYPE, searchQuery)
            .then((json: any) => {
                if (json && json.length > 0) {
                    Log.debug("[Invoice] Result find invoice by date: ", json);
                    return json.map((result: any) => {
                        return new Invoice(result._source, result._id);
                    });
                } else {
                    return [];
                }
            });
    }
}