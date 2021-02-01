export { }

import { SAMLService } from "../components/SAMLService";

const express = require('express');
const router = express.Router();
SAMLService.getInstance().bindRouter(router);
module.exports = router;