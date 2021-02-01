import { Elasticsearch } from "../components/Elasticsearch";

export default class StoreV2 extends Elasticsearch {
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

  findStoreByIDs(storeIDs: string) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          terms: {
            _id: [storeIDs],
          },
        },
      },
    });
  }

  findStoreByEmail(email: string) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          bool: {
            should: [
              [
                {
                  term: {
                    "storeInfo.businessProfile.businessEmail.keyword": email,
                  },
                },
                {
                  term: {
                    "storeInfo.companyInfo.email.keyword": email,
                  },
                },
              ],
            ],
          },
        },
      },
    });
  }

  updateStoreByID(storeID: string, store: any) {
    return this.elasticsearch.client.update({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      id: storeID,
      body: {
        doc: store,
      },
    });
  }
}
