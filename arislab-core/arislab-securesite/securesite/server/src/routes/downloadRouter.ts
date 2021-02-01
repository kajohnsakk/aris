import * as Express from 'express';
import { Request, Response } from "express";
import { ErrorObject } from '../utils/ErrorObject';
import { Log } from '../utils/Log';

const router = Express.Router();

const redirectToDownloadMobileApp = (req: Request, res: Response) => {
	const userAgent = req.header('user-agent');
	var redirectUrl;

	if (/iPad|iPhone|iPod/.test(userAgent)) {
		redirectUrl = process.env.IOS_APP_URL || 'https://apps.apple.com/us/app/aris/id1466936667';
	} else {
		redirectUrl = process.env.ANDROID_APP_URL || 'https://play.google.com/store/apps/details?id=ai.arislab.arislive';
	}

	res.redirect(redirectUrl);
}

router.get('/:fileType/:fileName', (req: Request, res: Response) => {
	const fileType = req.params.fileType;
	const fileName = req.params.fileName;

	if (fileType === 'app' && fileName === 'mobile') {
		redirectToDownloadMobileApp(req, res);
	} else {
		redirectToDownloadMobileApp(req, res);
	}

	res.end();
});


module.exports = router;