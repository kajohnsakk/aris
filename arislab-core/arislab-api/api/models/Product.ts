import { AbstractPersistentModel } from "./AbstractPersistentModel";
import {
  ElasticsearchClient,
  ElasticsearchQueryResultDocument,
} from "../components/ElasticsearchClient";
import { Log } from "../ts-utils/Log";

export interface productVariationJSON {
  remainingStock?: number;
  outOfStock?: boolean;
  image: string;
  color: string;
  size: {
    [key: string]: {
      value: {
        price: number;
        stock: number;
        startingStock: number;
        sku: string;
        isNotAvailable: boolean;
      };
    };
  };
}

export interface productUniversalInfoJSON {
  stock: number;
  startingStock: number;
  price: number;
  sku: string;
}

export interface shippingRateJSON {
  firstpiece: number;
  nextpiece: number;
}

export interface productInfoJSON {
  productBrandName: string;
  productName: string;
  productDescription: string;
  productHashtag: string;
  productWeight: number;
  productImage: string;
  enableProductImage: boolean;
  enableSizeTable: boolean;
  enableSKU: boolean;
  enableShippingRate: boolean;
  disableAddress: boolean;
  isVoucher: boolean;
  sizeTableImage: string;
  closeupImage: object;
  productTypeOption: object;
  productColorOptions: string[];
  productSizeOptions: string[];
  productVariations: productVariationJSON[];
  productFAQDetailsOption: string[];
  productFAQDetails: string[];
  createAt: number;
  isDeleted: boolean;
  individualProductType: string;
  productUniversalInfo: productUniversalInfoJSON;
  isNotAvailable: boolean;
  shippingRate: shippingRateJSON;
}

export interface JSONData {
  storeID: string;
  productInfo: productInfoJSON;
  productID: string;
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

  public toJSON(): any {
    return {
      storeID: this.storeID,
      productID: this.productID,
      productInfo: this.productInfo,
    };
  }

  public static findById(
    storeID: string,
    findAllProduct?: boolean,
    count?: boolean
  ) {
    Log.debug("Finding product by store id: " + storeID);

    let matchDelete = {};

    if (!findAllProduct) {
      matchDelete = {
        match: {
          "productInfo.isDeleted": false,
        },
      };
    }

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              match: {
                "storeID.keyword": storeID,
              },
            },
            matchDelete,
          ],
        },
      },
      sort: [{ "productInfo.createAt": "desc" }],
    };

    if (count) {
      return ElasticsearchClient.getInstance()
        .count(this.TYPE, searchQuery)
        .then((resultCount: any) => {
          return resultCount;
        });
    }

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return json.map((result: any) => {
            // Log.debug('resultFindProductByStoreID: ', result);
            return new Product(result._source, result._id);
          });
        } else {
          return [];
        }
      })
      .catch((error) => {
        Log.error("Error while finding product by id ", error);
        throw error;
      });
  }

  public static findByProductID(productID: string): Promise<Product> {
    const query = { query: { match: { _id: productID } } };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, query)
      .then((resultFindByProductID: ElasticsearchQueryResultDocument[]) => {
        if (resultFindByProductID && resultFindByProductID.length > 0) {
          return new Product(
            resultFindByProductID[0]._source,
            resultFindByProductID[0]._id
          );
        } else {
          return null;
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  public static findProductById(
    storeID: string,
    productID: string,
    includeDeletedProduct?: boolean
  ): Promise<Product[]> {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { "storeID.keyword": storeID } },
            { match: { _id: productID } },
            // { "match": { "productInfo.isDeleted": false } }
          ],
        },
      },
    };

    if (includeDeletedProduct) {
      /*
                If includeDeletedProduct is not empty or false
                Remove { "match": { "productInfo.isDeleted": false } } from searchQuery variable
            */
      searchQuery["query"]["bool"]["must"] = searchQuery["query"]["bool"][
        "must"
      ].filter((match, index) => {
        if (
          searchQuery["query"]["bool"]["must"][index]["match"].hasOwnProperty(
            "productInfo.isDeleted"
          )
        ) {
          return false;
        }
        return true;
      });
    }

    Log.debug(
      "Finding product by store id: " +
      storeID +
      " and productID: " +
      productID +
      " with query: ",
      searchQuery
    );

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return json.map((result: any) => {
            Log.debug("resultFindProductById: ", result);
            return new Product(result._source, result._id);
          });
        } else {
          return [];
        }
      });
  }

  public static findProductDetailsByHashtag(
    storeID: string,
    productHashtag: string
  ) {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { term: { "storeID.keyword": storeID } },
            { match: { "productInfo.productHashtag": productHashtag } },
            { term: { "productInfo.isDeleted": false } },
          ],
        },
      },
    };

    Log.debug(
      "[Product] Finding product details by hashtag with query ",
      searchQuery
    );

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          Log.debug("[Product] Result find product details by hashtag: ", json);

          return json.map((result: any, index: number) => {
            result._source.productInfo.productVariations.forEach(
              (variation: any) => {
                let remainingStock = 0;

                result._source.productInfo.productSizeOptions.forEach(
                  (sizeObj: any) => {
                    let sizeValue = sizeObj["value"];

                    // Don't count isNotAvailable === true in remainingStock
                    if (
                      variation["size"][sizeValue]["value"][
                      "isNotAvailable"
                      ] === false
                    ) {
                      remainingStock +=
                        variation["size"][sizeValue]["value"]["stock"];
                    }
                  }
                );

                variation["remainingStock"] = remainingStock;

                if (remainingStock > 0) {
                  variation["outOfStock"] = false;
                } else {
                  variation["outOfStock"] = true;
                }
              }
            );

            return new Product(result._source, result._id);
          });
        } else {
          return [];
        }
      })
      .catch((error) => {
        Log.error("Error while finding product by hashtag ", error);
        throw error;
      });
  }

  public static findProductFAQByHashtag(
    storeID: string,
    productHashtag: string,
    faqType: string
  ) {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { term: { "storeID.keyword": storeID } },
            { match: { "productInfo.productHashtag": productHashtag } },
          ],
        },
      },
    };

    Log.debug(
      "[Product] Finding product FAQ by hashtag with query ",
      searchQuery
    );

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          Log.debug("[Product] Result find product FAQ by hashtag: ", json);

          return json.map((result: any) => {
            let productFAQDetails;
            let productFAQDetailsOption;

            if (
              result._source.productInfo.productFAQDetails.hasOwnProperty(
                faqType
              )
            ) {
              productFAQDetails =
                result._source.productInfo.productFAQDetails[faqType];
            } else {
              productFAQDetails = {
                additionalInfo: "-",
              };
            }

            if (
              result._source.productInfo.productFAQDetailsOption.hasOwnProperty(
                faqType
              )
            ) {
              productFAQDetailsOption =
                result._source.productInfo.productFAQDetailsOption[faqType];
            } else {
              productFAQDetailsOption = {
                label: "-",
              };
            }

            return {
              storeID: result._source.storeID,
              productInfo: {
                productBrandName: result._source.productInfo.productBrandName,
                productName: result._source.productInfo.productName,
                productHashtag: result._source.productInfo.productHashtag,
                productFAQDetails: productFAQDetails,
                productFAQDetailsOption: productFAQDetailsOption,
                productColorOptions:
                  result._source.productInfo.productColorOptions,
                productSizeOptions:
                  result._source.productInfo.productSizeOptions,
              },
            };
          });
        } else {
          return [];
        }
      });
  }

  public static async checkInventoryByProductId(
    productID: string,
    color?: string,
    size?: string
  ) {
    try {
      const json: any = await ElasticsearchClient.getInstance().get(
        this.TYPE,
        productID
      );
      let individualProductType = json.productInfo.individualProductType;
      Log.debug(
        `Checking product inventory of productID: ${productID} with product type: ${individualProductType}`
      );
      let stockValue;
      if (
        individualProductType === "MULTI" ||
        individualProductType === "COLOR_ONLY"
      ) {
        let colorIndex: number;
        if (individualProductType === "COLOR_ONLY") {
          // If product type is COLOR_ONLY, Convert size value back to uppercase
          size = size.toUpperCase();
        }
        json.productInfo.productVariations.forEach(
          (resultVariation: any, index: number) => {
            if (color === resultVariation.color) {
              colorIndex = index;
            }
          }
        );
        let valueObj =
          json.productInfo.productVariations[colorIndex].size[size].value;
        if (!valueObj["isNotAvailable"]) {
          stockValue = valueObj["stock"];
        } else {
          stockValue = 0;
        }
        Log.debug(
          `[${individualProductType}] Product ID: ${productID} has remaining stock is: ${stockValue}`
        );
      } else if (individualProductType === "SINGLE" || individualProductType === "VOUCHER") {
        stockValue = json.productInfo.productUniversalInfo.stock;
        Log.debug(
          `[${individualProductType}] Product ID: ${productID} has remaining stock is: ${stockValue}`
        );
      }
      return { stock: stockValue };
    } catch (err) {
      Log.error(
        "Error while checking inventory of productID: ",
        productID,
        " with: ",
        err
      );
      return err;
    }
  }

  public static async updateInventoryByProductId(
    productID: string,
    increaseOrDecrease: string,
    quantity: Number,
    color?: string,
    size?: string
  ) {
    try {
      const json: any = await ElasticsearchClient.getInstance().get(
        this.TYPE,
        productID
      );
      const individualProductType = json.productInfo.individualProductType;
      Log.debug(
        `Updating product inventory of productID ${productID} with current product type: ${individualProductType}`
      );

      if (
        individualProductType === "MULTI" ||
        individualProductType === "COLOR_ONLY"
      ) {
        const productVariationsObj = json.productInfo.productVariations;

        let colorIndex: number;

        if (individualProductType === "COLOR_ONLY") {
          // if product type is COLOR_ONLY convert size value back to uppercase
          size = size.toUpperCase();
        }

        productVariationsObj.forEach(
          (resultVariation: productVariationJSON, index: number) => {
            if (color === resultVariation.color) {
              colorIndex = index;
            }
          }
        );

        let stock =
          json.productInfo.productVariations[colorIndex].size[size].value.stock;
        Log.debug(
          `[${individualProductType}] Current remaining stock of productID: ${productID} color: ${color} size: ${size} is: ${stock}`
        );

        if (increaseOrDecrease === "DECREASE") {
          json.productInfo.productVariations[colorIndex].size[
            size
          ].value.stock = Number(stock) - Number(quantity);
        } else if (increaseOrDecrease === "INCREASE") {
          json.productInfo.productVariations[colorIndex].size[
            size
          ].value.stock = Number(stock) + Number(quantity);
        }

        Log.debug(
          `[${individualProductType}] Updating stock with ${increaseOrDecrease} mode of productID: ${productID} color: ${color} size: ${size} to: ${json.productInfo.productVariations[colorIndex].size[size].value.stock}`
        );
      } else if (individualProductType === "SINGLE" || individualProductType === "VOUCHER") {
        let stock = json.productInfo.productUniversalInfo.stock;
        Log.debug(
          `[${individualProductType}] Current remaining stock of productID: ${productID} is: ${stock}`
        );

        if (increaseOrDecrease === "DECREASE") {
          json.productInfo.productUniversalInfo.stock =
            Number(stock) - Number(quantity);
        } else if (increaseOrDecrease === "INCREASE") {
          json.productInfo.productUniversalInfo.stock =
            Number(stock) + Number(quantity);
        }

        Log.debug(
          `[${individualProductType}] Updating stock with ${increaseOrDecrease} mode of productID: ${productID} to: ${json.productInfo.productUniversalInfo.stock}`
        );
      }
      const updatedQuantityJSON = json;
      Log.debug(
        "resultUpdateInventoryByProductId of productID " + productID + " is: ",
        updatedQuantityJSON
      );
      return ElasticsearchClient.getInstance().update(
        this.TYPE,
        productID,
        updatedQuantityJSON,
        false
      );
    } catch (err) {
      Log.error(
        "Error while updating inventory of productID: ",
        productID,
        " with: ",
        err
      );
      return err;
    }
  }

  public static async findMultipleProductDetails(productList: Array<string>) {
    try {
      const json: any = await ElasticsearchClient.getInstance().mget(
        this.TYPE,
        productList
      );
      if (json && json.length > 0) {
        return json.map((result: any) => {
          return new Product(result._source, result._id);
        });
      } else {
        return [];
      }
    } catch (error) {
      Log.error("Error while finding multiple product details: ", error);
      throw error;
    }
  }

  public static async deleteProduct(productID: string) {
    Log.debug("Deleting product id ", productID);
    const deleteQuery = {
      productInfo: {
        isDeleted: true,
      },
    };

    try {
      const resultUpdate = await ElasticsearchClient.getInstance().update(
        this.TYPE,
        productID,
        deleteQuery,
        false
      );
      Log.debug(
        "result delete product id " + productID + " is: ",
        resultUpdate
      );
      return resultUpdate;
    } catch (err) {
      Log.error("Error while deleting product id with ", err);
      return err;
    }
  }

  public static async getRealTimeProduct(productList: Array<string>) {
    Log.debug(
      "[Product] Getting realtime product with product list: ",
      productList
    );
    try {
      const resultFindMultipleProduct = await this.findMultipleProductDetails(
        productList
      );
      return resultFindMultipleProduct;
    } catch (error) {
      Log.error("Error while getting realtime product ", error);
      return error;
    }
  }

  public static findProductList(findAllProduct?: boolean, count?: boolean) {
    Log.debug("Finding product list.");

    let matchDelete = {};

    if (!findAllProduct) {
      matchDelete = {
        match: {
          "productInfo.isDeleted": false,
        },
      };
    }

    let searchQuery = {
      query: {
        bool: {
          must: [matchDelete],
        },
      },
      sort: [{ "productInfo.createAt": "desc" }],
    };

    if (count) {
      return ElasticsearchClient.getInstance()
        .count(this.TYPE, searchQuery)
        .then((resultCount: any) => {
          return resultCount;
        });
    }

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return json.map((result: any) => {
            // Log.debug('resultFindProductByStoreID: ', result);
            return new Product(result._source, result._id);
          });
        } else {
          return [];
        }
      })
      .catch((error) => {
        Log.error("Error while finding product by id ", error);
        throw error;
      });
  }

  public static customQuery(query: any) {
    return ElasticsearchClient.getInstance().search(this.TYPE, query);
  }
}
