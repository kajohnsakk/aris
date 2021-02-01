import { User, UserMongo } from "../models";

class UserService {
  async getUsers() {
    const user = new User();
    const users = await user.getUsers();
    return {
      total: users.hits.hits.length,
      users: users.hits.hits,
    };
  }

  async insert() {
    try {
      const user = new UserMongo();
      const userInfo = {
        firstName: "demo",
        lastname: "demo",
        username: "demo",
      };
      const userCreated = await user.insert(userInfo);

      return {
        data: userCreated,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
