import path from "path";
const rootDir = path.resolve("./");

export default {
  database: {
    mongo: {
      uri:
        "mongodb+srv://arislab:arislab@arislab.lnlz3.mongodb.net?retryWrites=true&w=majority",
      db: "arislab",
    },
    elasticsearch: {
      host:
        "elastic:4KYpEDDrxGod9rddatrxmSKX@e865b4fe9f434efbaa337fd2e30e417c.ap-southeast-1.aws.found.io:9243",
      index: "dev-arislab-platform",
      username: "arislab-platform",
      password: "arislab-platform",
    },
  },
  log: {
    rapid7: {
      token: "1255309c-e9b5-4ef7-9d98-5bf6eac596e6", // default is dev
      region: "au",
    },
  },
  upload: {
    path: `${rootDir}/uploads`,
  },
};
