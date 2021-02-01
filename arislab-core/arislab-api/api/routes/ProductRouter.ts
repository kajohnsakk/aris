export { };
import { JSONData as ProductJSON, Product } from '../models/Product';
import uuidv4 from 'uuid/v4';
import { Log } from '../ts-utils/Log';
import { ErrorObject } from '../ts-utils/ErrorObject';
import * as express from 'express';
import { Request, Response } from "express";
import { AsyncForEach } from '../ts-utils/AsyncForEach';

const router = express.Router();
const timeUuid = require('time-uuid');

const findExistsHashtag = (storeID: string, hashtag: string) => {
    return Product.findProductDetailsByHashtag(storeID, hashtag)
        .then((resultFindHashtag) => {
            return Promise.resolve(resultFindHashtag);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

router.get('/storeID/:storeID/', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    Product.findById(storeID).then((resultFindByID: any) => {
        res.send(resultFindByID);
        res.end();
    });
});

router.get('/storeID/:storeID/product/:productID/details', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let productID = req.params.productID;
    Product.findProductById(storeID, productID).then((resultFindProductByID: any) => {
        res.send(resultFindProductByID);
        res.end();
    });
});

router.get('/productID/:productID/', (req: Request, res: Response) => {
    let productID = req.params.productID;
    Product.findByProductID(productID).then((resultFindByProductID: any) => {
        Log.debug("find By Product ID ",resultFindByProductID)
        res.send(resultFindByProductID);
        res.end(); 
    });
});

router.get('/storeID/:storeID/product/productHashtag/:productHashtag/details', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let productHashtag = req.params.productHashtag.toLowerCase();

    Product.findProductDetailsByHashtag(storeID, productHashtag).then((resultFindProductDetailsByHashtag: any) => {
        res.send(resultFindProductDetailsByHashtag);
        res.end();
    });
});

router.get('/storeID/:storeID/product/:productHashtag/faqDetails', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let productHashtag = req.params.productHashtag.toLowerCase();
    let faqType = req.query.faqType;

    Product.findProductFAQByHashtag(storeID, productHashtag, faqType).then((resultFindProductFAQByHashtag: any) => {
        res.send(resultFindProductFAQByHashtag);
        res.end();
    });
});

router.post('/storeID/:storeID/product/new', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('req body is ', req.body);

    let storeID = req.params.storeID;
    let updateData: ProductJSON;
    let requestBody = defaultValueProductInfo(req.body);

    requestBody['createAt'] = Date.now();
    requestBody['isDeleted'] = false;

    // let productID = requestBody['productID'];

    let productID = timeUuid();

    updateData = {
        storeID: storeID,
        productInfo: requestBody,
        productID: productID
    }

    // delete updateData['productInfo']['productID'];

    Log.debug('Creating new product with ', updateData);

    let updateObj = new Product(updateData, productID);
    res.send(updateObj.getUuid());
    res.end();
    return updateObj.update(updateData);
});

router.post('/storeID/:storeID/product/:productID/update', (req: Request, res: Response) => {
    Log.debug('storeID is ', req.params.storeID);
    Log.debug('productID is ', req.params.productID);

    let storeID = req.params.storeID;
    let productID = req.params.productID;
    let updateData: ProductJSON;

    updateData = {
        storeID: storeID,
        productInfo: req.body,
        productID: productID
    }

    Log.debug('Updating product id: ' + productID + ' of store id : ' + storeID + ' with data: ', updateData);
    res.send(200);
    res.end();

    let updateObj = new Product(updateData, productID);
    return updateObj.update(updateData);
});

router.post('/storeID/:storeID/product/:productID/checkInventory', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let productID = req.params.productID;

    let color;
    let size;

    if (req.body.color) {
        color = req.body.color;
    }

    if (req.body.size) {
        size = req.body.size;
    }

    if (color && size) {
        // If color and size is not empty
        Product.checkInventoryByProductId(productID, color, size)
            .then((resultCheckInventoryByProductId: any) => {
                res.send(resultCheckInventoryByProductId);
                res.end();
            });
    } else {
        Product.checkInventoryByProductId(productID)
            .then((resultCheckInventoryByProductId: any) => {
                res.send(resultCheckInventoryByProductId);
                res.end();
            });
    }
});

router.post('/checkInventoryMultipleProducts', async (req: Request, res: Response) => {
    try {
        const reqBody: { [key: string]: any }[] = req.body;

        if (!reqBody || reqBody.length <= 0) {
            throw ErrorObject.NULL_OBJECT.send("Request body can't be empty");
        } else {
            Log.debug('Checking inventory of productID with body: ', reqBody);

            const promises: Promise<any>[] = [];

            // Iterating over request body to push promise into the array
            await AsyncForEach.foreach(reqBody, (reqObj: { [key: string]: string }) => {
                const productID = reqObj.productID;
                const color = (reqObj.color) ? reqObj.color : "";
                const size = (reqObj.size) ? reqObj.size : "";

                if (color && size) {
                    promises.push(Product.checkInventoryByProductId(productID, color, size));
                } else {
                    promises.push(Product.checkInventoryByProductId(productID));
                }
            });

            // Then resolve all promises that's already in the array
            const resultCheckMultipleProductID = await Promise.all(promises);
            const resultCheckForEmptyStock = resultCheckMultipleProductID.filter((stockObj: { [key: string]: number }) => {
                return stockObj.stock <= 0;
            });

            let result = { "status": "ALL_IN_STOCK" };
            if (resultCheckForEmptyStock.length > 0) result['status'] = "SOME_OUT_OF_STOCK";

            res.send(result);
            res.end();
        }
    } catch (error) {
        Log.error('Error while checking inventory of multiple products: ', error);
        throw error;
    }
});

router.post('/updateMultipleProducts', async (req: Request, res: Response) => {
    try {
        const reqBody: { [key: string]: any }[] = req.body;

        if (!reqBody || reqBody.length <= 0) {
            throw ErrorObject.NULL_OBJECT.send("Request body can't be empty");
        } else {
            Log.debug('Updating multiple products with body: ', reqBody);

            const promises: Promise<any>[] = [];
            const productIDsToUpdate: Array<string> = [];

            // Iterating over request body to push promise into the array
            await AsyncForEach.foreach(reqBody, async (reqObj: { [key: string]: string }) => {
                const productID = reqObj.productID;
                const updateType = reqObj.updateType.toUpperCase();
                const quantity = Number(reqObj.quantity);
                const color = (reqObj.color) ? reqObj.color : "";
                const size = (reqObj.size) ? reqObj.size : "";

                productIDsToUpdate.push(`${productID}_${color}_${size}`);

                if (color && size) {
                    promises.push(await Product.updateInventoryByProductId(productID, updateType, quantity, color, size));
                } else {
                    promises.push(await Product.updateInventoryByProductId(productID, updateType, quantity));
                }
            });

            // Perform update multiple products
            const resultUpdateMultipleProducts = await Promise.all(promises);

            let result: { [key: string]: any } = { "status": "FAILED" }
            if (resultUpdateMultipleProducts.length > 0) {
                result['status'] = "SUCCESS";
                result['updatedItems'] = productIDsToUpdate;
            }

            res.send(result);
            res.end();
        }
    } catch (error) {
        Log.error('Error while updating multiple products: ', error);
        throw error;
    }
});

router.post('/storeID/:storeID/product/:productID/updateInventory', (req: Request, res: Response) => {
    let storeID = req.params.storeID;
    let productID = req.params.productID;

    let updateType = req.body.updateType;
    let quantity = Number(req.body.quantity);
    let color;
    let size;

    if (req.body.color) {
        color = req.body.color;
    }

    if (req.body.size) {
        size = req.body.size;
    }

    if (req.body.updateType) {
        updateType = req.body.updateType.toUpperCase();
    }

    if (color && size) {
        // If color and size is not empty
        Product.updateInventoryByProductId(productID, updateType, quantity, color, size)
            .then((resultUpdateInventoryByProductId: any) => {
                res.send(resultUpdateInventoryByProductId);
                res.end();
            });
    } else {
        Product.updateInventoryByProductId(productID, updateType, quantity)
            .then((resultUpdateInventoryByProductId: any) => {
                res.send(resultUpdateInventoryByProductId);
                res.end();
            });
    }

});

router.post('/deleteMultipleProducts', (req: Request, res: Response) => {
    let productIDList: Array<string> = req.body.productIDList;

    if (!productIDList) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        productIDList.forEach((productID) => {
            Product.deleteProduct(productID)
                .then((resultDeleteProduct: any) => {
                    res.send(resultDeleteProduct);
                    res.end();
                });
        });
    }
});

router.post('/productInfo', (req: Request, res: Response) => {
    let productList = req.body.productList;

    Product.findMultipleProductDetails(productList).then((resultFindMultipleProductDetails: any) => {
        Log.debug('resultFindMultipleProductDetails', resultFindMultipleProductDetails);
        res.send(resultFindMultipleProductDetails);
        res.end();
    });
});

router.get('/generateNewHashtag/storeID/:storeID/', (req: Request, res: Response) => {
    // let storeID = req.body.storeID;
    let storeID = req.params.storeID;

    if (!storeID) {
        throw ErrorObject.NULL_OBJECT;
    } else {
        Product.findById(storeID, false, true)
            .then(async (productCount) => {
                // Simple way to generate new hashtag
                // Just use total product count + 1
                // res.send({
                //     hashtag: parseInt(productCount + 1)
                // });
                // res.end();

                // Count total hashtag and find which hashtag can be used
                for (let i = 0; i < parseInt(productCount); i++) {
                    let index = i;
                    let currentCount = (index + 1);

                    Log.debug(`Generating hashtag #${currentCount}`);

                    try {
                        let resultFindHashtag = await findExistsHashtag(storeID, currentCount.toString());

                        Log.debug(`Checking hashtag #${currentCount} is exists or not`);

                        if (resultFindHashtag.length > 0) {
                            Log.debug(`Hashtag #${currentCount} is exist, generating the next one...`);
                            continue;
                        } else {
                            Log.debug(`Hashtag #${currentCount} is not in use, use this one!`);
                            res.send({
                                hashtag: `${currentCount}`
                            });
                            res.end();
                            break;
                        }
                    } catch (error) {
                        Log.error('Error while finding exists hashtag ', error);
                    }
                }
                res.send({
                    hashtag: parseInt(productCount + 1)
                });
                res.end();
            })
            .catch((error) => {
                Log.error('Error while finding product by id ', error);
                res.send(error);
                res.end();
            })
    }
});


router.get('/getRealTimeProduct/:products', (req: Request, res: any) => {
    const products: string[] = decodeURI(req.params.products).split(',');
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
    });

    res.write("\n\n");

    let timer = setInterval(() => {
        Product.findMultipleProductDetails(products).then((resultFindByProducts: any) => {
            res.write(`data: ${JSON.stringify(resultFindByProducts)}` + "\n\n")
            res.flush()
        }).catch((error) => {
            Log.error('Error while getting real time product (router)', error);
            res.end()
        })
    }, 5000);

    req.on('close', () => {
        clearInterval(timer);
    });
});

function defaultValueProductInfo(requestBody: any): any {

    if (requestBody.hasOwnProperty("productWeight")) {
        requestBody.productWeight = Number(requestBody.productWeight);
    }

    if (requestBody.hasOwnProperty("productHashtag")) {
        // requestBody.productHashtag = requestBody.productHashtag.toLowerCase();
        requestBody.productHashtag = requestBody.productHashtag.toString();
    }

    if (requestBody.hasOwnProperty("productTypeOption")) {
        requestBody.productTypeOption = requestBody.productTypeOption;
    }

    if (requestBody.hasOwnProperty("productColorOptions")) {
        requestBody.productColorOptions = requestBody.productColorOptions;
    }

    if (requestBody.hasOwnProperty("productSizeOptions")) {
        requestBody.productSizeOptions = requestBody.productSizeOptions;
    }

    if (requestBody.hasOwnProperty("subCategoryLevel1Value")) {
        requestBody.subCategoryLevel1Value = requestBody.subCategoryLevel1Value;
    }

    if (requestBody.hasOwnProperty("subCategoryLevel2Value")) {
        requestBody.subCategoryLevel2Value = requestBody.subCategoryLevel2Value;
    }

    if (requestBody.hasOwnProperty("subCategoryLevel1SelectedOption")) {
        requestBody.subCategoryLevel1SelectedOption = requestBody.subCategoryLevel1SelectedOption;
    }

    if (requestBody.hasOwnProperty("subCategoryLevel2SelectedOption")) {
        requestBody.subCategoryLevel2SelectedOption = requestBody.subCategoryLevel2SelectedOption;
    }

    if (requestBody.hasOwnProperty("productFAQDetailsOption")) {
        requestBody.productFAQDetailsOption = requestBody.productFAQDetailsOption;
    }

    if (requestBody.hasOwnProperty("productVariations") && requestBody.productVariations.length > 0) {
        let productVariations = requestBody.productVariations;

        productVariations.forEach((productVariation: any) => {
            if (productVariation.hasOwnProperty('size')) {
                return Object.keys(productVariation['size']).map((itemSize) => {
                    if (productVariation.hasOwnProperty('size')) {
                        return Object.keys(productVariation['size']).map((itemSize) => {
                            let productVariationVal = productVariation['size'][itemSize]['value'];

                            if (productVariationVal.hasOwnProperty('price') || typeof productVariationVal['price'] !== "number") {
                                productVariationVal['price'] = Number(productVariationVal['price'])
                            } else {
                                productVariationVal['price'] = Number(0);
                            }

                            if (productVariationVal.hasOwnProperty('stock') || typeof productVariationVal['stock'] !== "number") {
                                productVariationVal['stock'] = Number(productVariationVal['stock'])
                            } else {
                                productVariationVal['stock'] = Number(0);
                            }

                            if (productVariationVal.hasOwnProperty('isNotAvailable') || typeof productVariationVal['isNotAvailable'] !== "boolean") {
                                productVariationVal['isNotAvailable'] = Boolean(productVariationVal['isNotAvailable'])
                            } else {
                                productVariationVal['isNotAvailable'] = false;
                            }

                            return productVariationVal;
                        });

                    }
                });
            }
        });
    }

    if (requestBody.hasOwnProperty("individualProductType")) {
        requestBody.individualProductType = (requestBody.individualProductType.length > 0) ? requestBody.individualProductType : 'SINGLE';
    } else {
        requestBody.individualProductType = 'SINGLE';
    }

    if (requestBody.hasOwnProperty("productUniversalInfo")) {
        if (!requestBody.productUniversalInfo.hasOwnProperty("price") || !requestBody.productUniversalInfo.hasOwnProperty("stock")) {
            requestBody.productUniversalInfo = {
                price: 0,
                stock: 0
            };
        } else {
            // requestBody.productUniversalInfo = requestBody.productUniversalInfo;

            if (requestBody.productUniversalInfo.hasOwnProperty('price') || typeof requestBody.productUniversalInfo['price'] !== "number") {
                requestBody.productUniversalInfo['price'] = Number(requestBody.productUniversalInfo['price'])
            } else {
                requestBody.productUniversalInfo['price'] = Number(0);
            }

            if (requestBody.productUniversalInfo.hasOwnProperty('stock') || typeof requestBody.productUniversalInfo['stock'] !== "number") {
                requestBody.productUniversalInfo['stock'] = Number(requestBody.productUniversalInfo['stock'])
            } else {
                requestBody.productUniversalInfo['stock'] = Number(0);
            }
        }
    } else {
        requestBody.productUniversalInfo = {
            price: 0,
            stock: 0
        };
    }

    if (requestBody.hasOwnProperty("shippingRate")) {
        if (requestBody.shippingRate.hasOwnProperty('firstpiece') || typeof requestBody.shippingRate['firstpiece'] !== "number") {
            requestBody.shippingRate['firstpiece'] = Number(requestBody.shippingRate['firstpiece']);
        } else {
            requestBody.shippingRate['firstpiece'] = Number(0);
        }
        if (requestBody.shippingRate.hasOwnProperty('nextpiece') || typeof requestBody.shippingRate['nextpiece'] !== "number") {
            requestBody.shippingRate['nextpiece'] = Number(requestBody.shippingRate['nextpiece']);
        } else { 
            requestBody.shippingRate['nextpiece'] = Number(0);
        }
    }

    return requestBody;

}

module.exports = router;