import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { AbstractPersistentModel } from "./AbstractPersistentModel";

export interface productUniversalInfoJSON {
    stock: number,
    price: number,
}
export interface productInfoJSON {
    productID: string,
    productBrandName: string,
    productName: string,
    productDescription: string,
    productHashtag: string,
    productWeight: string,
    productImage: string,
    productTypeOption: object,
    productColorOptions: string[],
    productSizeOptions: string[],
    productVariations: ProductVariationJson[],
    productFAQDetailsOption: string[],
    productFAQDetails: string[],
    createAt: number,
    isDeleted: boolean,
    individualProductType: string,
    productUniversalInfo: productUniversalInfoJSON
}
export interface ProductVariationJson {
    image: string,
    color: string,
    size: {
        [key: string]: {
            value: {
                price: string,
                stock: string,
                sku: string,
                isNotAvailable: boolean
            }
        }
    }
}

export interface JSONData {
    storeID: string,
    productInfo: productInfoJSON
}

export class Product extends AbstractPersistentModel {
    public storeID: string;
    public productID: string;
    public productInfo: productInfoJSON;
    constructor(json: JSONData, productID?: string) {
        super(productID);
        this.storeID = json.storeID;
        this.productID = productID;
        this.productInfo = json.productInfo;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "product";
    protected getType(): string {
        return Product.TYPE;
    }
    public getProductMinPrice() {
        // let minPrice = Number.MAX_SAFE_INTEGER;
        // this.productInfo.productVariations.forEach(variation=>{
        //     const sizeNames = Object.keys(variation.size);
        //     for(let sizeName of sizeNames){
        //         let price = Number(variation.size[sizeName].value.price);
        //         if (price > 0 &&  minPrice > price){
        //             minPrice = price;
        //         }
        //     }
        // });
        // return minPrice;

        let minPrice = Number.MAX_SAFE_INTEGER;
        let maxPrice = 0;

        if (this.productInfo.individualProductType === 'SINGLE' || this.productInfo.individualProductType === 'VOUCHER') {
            minPrice = Math.min(minPrice, this.productInfo.productUniversalInfo.price);
            maxPrice = Math.max(maxPrice, this.productInfo.productUniversalInfo.price);
        } else if (this.productInfo.individualProductType === 'MULTI' || this.productInfo.individualProductType === 'COLOR_ONLY') {
            this.productInfo.productVariations.forEach(variation => {

                if (variation && variation.hasOwnProperty('size')) {
                    const sizeNames = Object.keys(variation.size);
                    for (let sizeName of sizeNames) {
                        if (variation.size[sizeName].value.hasOwnProperty('isNotAvailable') && variation.size[sizeName].value.isNotAvailable === false) {
                            let price = Number(variation.size[sizeName].value.price);
                            if (price) {
                                minPrice = Math.min(minPrice, price);
                                maxPrice = Math.max(maxPrice, price);
                            }
                        }
                    }
                }

            });
        }

        minPrice = Math.min(minPrice, maxPrice);

        if (minPrice !== maxPrice) {
            return minPrice + ' ~ ' + maxPrice;
        } else {
            return minPrice;
        }
    }
    public toJSON(): any {
        if (this.productInfo.hasOwnProperty("productImage") && this.productInfo.productImage.length === 0 || !this.productInfo.hasOwnProperty("productImage")) {
            this.productInfo.productImage = 'https://www.labaleine.fr/sites/baleine/files/image-not-found.jpg';
        }

        return {
            storeID: this.storeID,
            productID: this.productID,
            productInfo: this.productInfo,
            minPrice: this.getProductMinPrice()
        };
    }

    public static findProductByIds(productIDs: string[]): Promise<Product[]> {
        let searchQuery = {
            "query": {
                "ids": {
                    values: productIDs
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json) => {
            if (json && json.length > 0) {
                return json.map((result) => {
                    return new Product(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static getProductById(productID?: string): Promise<Product> {
        let searchQuery = {
            "query": {
                "match": {
                    "_id": productID
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json) => {
            if (json && json.length > 0) {
                return new Product(json[0]._source, json[0]._id);
            } else {
                return null;
            }
        });
    }
}