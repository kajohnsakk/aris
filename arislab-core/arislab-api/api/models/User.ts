import { Elasticsearch } from "./../components/Elasticsearch";

interface IUser {
  storeID: string;
  firstName: Boolean;
  lastName: Boolean;
  email: string;
  password: string;
  roles: [];
  permissions: [];
  createdAt: number;
  updatedAt: number;
}

export class User extends Elasticsearch {
  static getUsers: any;
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

  findUsersByStore(storeID: string, from: number = 0, size: number = 1000) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: "users",
      from,
      size,
      body: {
        query: {
          bool: {
            must: {
              match: {
                "storeID.keyword": storeID,
              },
            },
            must_not: {
              match: {
                "roles.keyword": "owner",
              },
            },
          },
        },
      },
    });
  }

  countUserStoreByEmail(storeID: string, email: string) {
    return this.elasticsearch.client.count({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          bool: {
            must: [
              { match: { "email.keyword": email } },
              { match: { "storeID.keyword": storeID } },
            ],
          },
        },
      },
    });
  }

  findUserByIDs(userIDs: string) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          terms: {
            _id: [userIDs],
          },
        },
      },
    });
  }

  findUserByEmail(email: string) {
    return this.elasticsearch.client.search({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: {
        query: {
          match: { "email.keyword": email },
        },
      },
    });
  }

  updateUserByID(userID: string, user: IUser) {
    return this.elasticsearch.client.update({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      id: userID,
      body: {
        doc: user,
      },
    });
  }

  async createUser(user: IUser) {
    const { count: countUser } = await this.countUserStoreByEmail(
      user.storeID,
      user.email
    );
    if (countUser > 0) {
      throw new Error("Email already exists. Please try with another one");
    }

    return this.elasticsearch.client.index({
      index: this.elasticsearch.config.index,
      type: this.TYPE,
      body: user,
    });
  }

  bulkDelete(userIDs: string[]) {
    const bulk = userIDs.map((id) => ({
      delete: {
        _index: this.elasticsearch.config.index,
        _type: this.TYPE,
        _id: id,
      },
    }));

    return this.elasticsearch.client.bulk({
      body: bulk,
    });
  }
}
