import * as elasticsearch from "elasticsearch";

import config from "../config/config";
const { host, username, password, index } = config.database.elasticsearch;

export interface IElasticsearchConfig {
  host: string;
  index: string;
}

class Elasticsearch {
  config!: IElasticsearchConfig;
  elasticsearch: any;

  constructor() {
    if (!this.elasticsearch) {
      const dbConfig = { host, index };

      const client = new elasticsearch.Client({
        host: `https://${host}`,
        httpAuth: `${username}:${password}`,
      });

      this.elasticsearch = { config: dbConfig, client };
    }
  }
}

export default Elasticsearch;
