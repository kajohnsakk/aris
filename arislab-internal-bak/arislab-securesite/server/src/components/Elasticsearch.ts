import * as elasticsearch from "elasticsearch";

const ELASTICSEARCH_HOST = process.env.nes;
const ELASTICSEARCH_INDEX = process.env.db_index;

export interface IElasticsearchConfig {
  host: string;
  index: string;
}

export interface IElasticesearch {
  client: any;
  config: IElasticsearchConfig;
}

export class Elasticsearch {
  config: IElasticsearchConfig;
  elasticsearch: IElasticesearch;

  constructor() {
    if (!this.elasticsearch) {
      const config = {
        host: ELASTICSEARCH_HOST,
        index: ELASTICSEARCH_INDEX,
      };

      const client = new elasticsearch.Client({
        host: `https://${ELASTICSEARCH_HOST}`,
        httpAuth: `${process.env.nuser}:${process.env.npwd}`,
      });

      this.elasticsearch = { config, client };
    }
  }
}
