import {Event} from '../models/Event'
import * as express from 'express'
import {Log} from "../utils/Log";
import {Response} from "express";
const router = express.Router();
router.get('/:eventId', (req: any, res: any) => {
    let eventId = req.params.eventId;
    Event.getEventById(eventId).then((event) => {
        res.json({event: event.toJSON(), products: event.products});
    });
});
router.get('/:eventId/mask', (req: any, res: any) => {
    let eventId = req.params.eventId;
    let activeProductId = req.query.activeProductId;
    Event.getEventById(eventId, activeProductId).then((event) => {
        let selectedIndex = event.products.findIndex(prod => {
            return prod.productID == activeProductId;
        });
		//if (selectedIndex < 0) selectedIndex = 0;
		
		let renderFileName = 'vertical-overlay';
		if( event.toJSON().videoOrientation === 'HORIZONTAL' ) {
			renderFileName = 'horizontal-overlay';
		}
		
        res.render(renderFileName, {
			layout: false,
            data: {
                event: event.toJSON(),
				selectedProduct: event.selectedProduct ? event.selectedProduct.toJSON() : null,
                products: event.products.map((prod, i) => {
                    const json = prod.toJSON();
					
					if( json.hasOwnProperty("productInfo") ) {
						if( (json.productInfo.hasOwnProperty("productImage") && json.productInfo.productImage.length === 0) || (!json.productInfo.hasOwnProperty("productImage")) ) {
							json.productInfo.productImage = 'https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg';
						}
					}
					
					if( isNaN(json.minPrice) || json.minPrice < 0 ) json.minPrice = 0;
					
                    if (selectedIndex == i) json.selected = true;
					
					if( i == selectedIndex ) {
						json.invisible = false;
					} else {
						json.invisible = true;
					}
					return json;
                }),
				closeup: event.products.map((prod, i) => {
                    if (selectedIndex == i) {
						let closeupJson: {
							image1: string,
							image2: string,
							image3: string
						} = { image1: null, image2: null, image3: null};
						const json = prod.toJSON();
						
						if( json.hasOwnProperty("productInfo") ) {
							if( json.productInfo.hasOwnProperty("closeupImage") ) {
								if( json.productInfo.closeupImage.hasOwnProperty("image1") && json.productInfo.closeupImage.image1.length ) {
									closeupJson.image1 = json.productInfo.closeupImage.image1;
								} else {
									//closeupJson.image1 = 'https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg';
								}
								
								if( json.productInfo.closeupImage.hasOwnProperty("image2") && json.productInfo.closeupImage.image2.length ) {
									closeupJson.image2 = json.productInfo.closeupImage.image2;
								} else {
									//closeupJson.image2 = 'https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg';
								}
								
								if( json.productInfo.closeupImage.hasOwnProperty("image3") && json.productInfo.closeupImage.image3.length ) {
									closeupJson.image3 = json.productInfo.closeupImage.image3;
								} else {
									//closeupJson.image3 = 'https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg';
								}
							}
						}
						
						return closeupJson;
					}
                    
                }),
				storeLogo: event.storeLogo
            }
        });
    });
});
router.get('/:eventId/mask/png', (req: any, res: Response) => {
    (async () => {
        let eventId = req.params.eventId;
        let activeProductId = req.query.activeProductId;
        const event = await Event.getEventById(eventId);
        const screenshot = await event.updateScreenshot(activeProductId);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshot.buffer.length
        });
		res.end(screenshot.buffer);
		// res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Content-Length': screenshot.path.length
		// });
        // res.end(screenshot.path);
        Log.debug("Take screenshot completed");
    })();
});
module.exports = router;