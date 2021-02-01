import { Log } from "../utils/Log";
export { }

const express = require('express');
const router = express.Router();
router.get('/', (req: any, res: any) => {
    Log.debug('req received with body: ', req.body);
});
module.exports = router;