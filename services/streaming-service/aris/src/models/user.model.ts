import { Elasticsearch } from "../lib";

class User extends Elasticsearch {
  TYPE: string;

  constructor() {
    /**
     * Elasticsearch provide the default parameters
     *
     * @param this.elasticesearch.client Elasticsearch instance
     * @param this.elasticesearch.config Elasticsearch configuration
     */
    super();

    this.TYPE = "users";
  }

  getUsers() {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {},
    });
  }
}

export default User;
