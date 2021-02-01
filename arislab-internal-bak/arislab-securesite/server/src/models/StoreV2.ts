import { Elasticsearch } from "../components/Elasticsearch";

export class StoreV2 extends Elasticsearch {
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

    this.TYPE = "store";
  }

  getStoreList(from: 0, size = 10000) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      from,
      scroll: "1m",
      size,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "verifyInfo.isVerified": true,
                },
              },
            ],
          },
        },
      },
    });
  }
}
