import * as jwt from "jsonwebtoken";

export default class JWT {
  token: any;
  SECRET_KEY: string;

  constructor(SECRET_KEY: string, token = "") {
    this.SECRET_KEY = SECRET_KEY;
    this.token = token;
  }

  sign(data: any, options: any = {}) {
    const token = jwt.sign(data, this.SECRET_KEY, options);
    return token;
  }

  verify() {
    return jwt.verify(this.token, this.SECRET_KEY);
  }
}
