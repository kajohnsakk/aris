const MongoClient = require("mongodb").MongoClient;

import config from "../config/config";
const { uri, db } = config.database.mongo;

class Mongo {
  uri: string;
  client: any;
  db: any;

  constructor() {
    this.uri = uri;
    this.client = undefined;
    this.db = undefined;
  }

  async connect(collection: string) {
    try {
      if (this.client) return this.client;

      const client = await MongoClient.connect(this.uri, {
        useNewUrlParser: true,
      });

      this.client = client;
      this.db = client.db(db).collection(collection);

      return this.db;
    } catch (error) {
      throw error;
    }
  }

  disconnect() {
    this.client.close();
    this.db = undefined;
  }
}

export default Mongo;
