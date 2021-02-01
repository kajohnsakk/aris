const Rapid7Logger = require("r7insight_node");

import config from "../config/config";
const { token, region } = config.log.rapid7;

export default new Rapid7Logger({
  token,
  region,
  timestamp: true,
  console: true,
});
