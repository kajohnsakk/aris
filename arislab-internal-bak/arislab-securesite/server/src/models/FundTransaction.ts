import { Elasticsearch } from "../components/Elasticsearch";

export class FundTransaction extends Elasticsearch {
  static getFundTransactions: any;
  TYPE: string;

  constructor() {
    /**
     * Elasticsearch provide the default parameters
     *
     * @param this.elasticesearch.client Elasticsearch instance
     * @param this.elasticesearch.config Elasticsearch configuration
     */
    super();

    this.TYPE = "funds_transaction";
  }

  getDepositSummaryByStoreID(storeID?: string) {
    const query: any = {
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "type.keyword": "DEPOSIT",
                },
              },
              {
                match: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
        aggs: {
          summary: {
            sum: {
              field: "actualAmount",
            },
          },
        },
      },
    };

    if (storeID) {
      query.body.query.bool.must.push({
        match: {
          "storeID.keyword": storeID,
        },
      });
    }

    return this.elasticsearch.client.search(query);
  }

  getWithdrawSummaryByStoreID(storeID?: string) {
    const query: any = {
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "type.keyword": "WITHDRAW",
                },
              },
              {
                match: {
                  "withdrawInfo.status.keyword": "SUCCESS",
                },
              },
              {
                match: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
        aggs: {
          summary: {
            sum: {
              field: "amount",
            },
          },
        },
      },
    };

    if (storeID) {
      query.body.query.bool.must.push({
        match: {
          "storeID.keyword": storeID,
        },
      });
    }

    return this.elasticsearch.client.search(query);
  }
}
