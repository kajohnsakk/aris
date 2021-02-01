import { Mongo } from "../lib";

class User extends Mongo {
  COLLECTION: string;

  constructor() {
    super();
    this.COLLECTION = "users";
  }

  async insert(payload: any) {
    const _self = this;
    const db = await this.connect(this.COLLECTION);
    return db.insertOne(payload).then((userCreated: any) => {
      _self.disconnect();
      return userCreated;
    });
  }
}

export default User;
