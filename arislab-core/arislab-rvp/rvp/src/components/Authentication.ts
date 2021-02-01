import * as jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export default class Authentication {
  token: any;
  constructor(token = "") {
    this.token = token;
  }

  sign(data: any, options: any = {}) {
    const token = jwt.sign(data, SECRET_KEY, options);
    return token;
  }

  verify() {
    return jwt.verify(this.token, SECRET_KEY);
  }
}
