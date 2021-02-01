export { }

import { Log } from "../ts-utils/Log";
import * as express from 'express';
import { Request, Response } from "express";

const router = express.Router();
router.get('/', (req: Request, res: Response) => {
    Log.debug('req received with body: ', req.body);
});
module.exports = router;