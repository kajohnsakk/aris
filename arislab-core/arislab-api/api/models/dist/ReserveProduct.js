"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ReserveProduct = void 0;
var AbstractPersistentModel_1 = require("./AbstractPersistentModel");
var ElasticsearchClient_1 = require("../components/ElasticsearchClient");
var Log_1 = require("../ts-utils/Log");
var json2csv_1 = require("json2csv");
var ReserveProduct = /** @class */ (function (_super) {
    __extends(ReserveProduct, _super);
    function ReserveProduct(cartID, storeID, customerInfo, products) {
        var _this = _super.call(this) || this;
        _this.storeID = storeID;
        _this.cartID = cartID;
        _this.customerInfo = customerInfo;
        _this.productList = products;
        _this.createdAt = Date.now();
        return _this;
    }
    ReserveProduct.prototype.doUpdate = function (json) {
        return true;
    };
    ReserveProduct.prototype.toJSON = function () {
        return {
            cartID: this.cartID,
            storeID: this.storeID,
            customerInfo: this.customerInfo,
            productList: this.productList,
            createdAt: this.createdAt
        };
    };
    ReserveProduct.prototype.getType = function () {
        return ReserveProduct.TYPE;
    };
    ReserveProduct.getReserveProductsByStoreID = function (storeID) {
        var query = {
            query: {
                match: { "storeID.keyword": storeID }
            }
        };
        return ElasticsearchClient_1.ElasticsearchClient.getInstance().search(ReserveProduct.TYPE, query);
    };
    ReserveProduct.exportToCsv = function (storeID) {
        return __awaiter(this, void 0, void 0, function () {
            var reserveProducts, output, fields, json2csvParser, csv, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getReserveProductsByStoreID(storeID)];
                    case 1:
                        reserveProducts = _a.sent();
                        output = reserveProducts.map(function (reserveProduct) {
                            var productInfo = reserveProduct._source.productList[0];
                            return {
                                reserveOrderNumber: reserveProduct._id,
                                customerName: reserveProduct._source.customerInfo.customerName,
                                customerEmail: reserveProduct._source.customerInfo.customerEmail,
                                customerPhoneNumber: "'" + reserveProduct._source.customerInfo.customerPhoneNo + "'",
                                productHashtag: productInfo.productHashtag,
                                productType: productInfo.productType,
                                productName: productInfo.productName,
                                productSize: productInfo.productValue.size,
                                productColor: productInfo.productValue.color,
                                productImage: productInfo.productImage,
                                sku: productInfo.productValue.sku ? productInfo.productValue.sku : "",
                                quantity: productInfo.originalQuantity,
                                price: productInfo.productValue.price,
                                reserveProductDate: productInfo.createdAt
                            };
                        });
                        fields = [
                            {
                                label: "Reserve Order Number",
                                value: "reserveOrderNumber"
                            },
                            {
                                label: "Customer Name",
                                value: "customerName"
                            },
                            {
                                label: "Customer Email",
                                value: "customerEmail"
                            },
                            {
                                label: "Customer Phone Number",
                                value: "customerPhoneNumber"
                            },
                            {
                                label: "Product Hashtag",
                                value: "productHashtag"
                            },
                            {
                                label: "Product Type",
                                value: "productType"
                            },
                            {
                                label: "Product Name",
                                value: "productName"
                            },
                            {
                                label: "Product Size",
                                value: "productSize"
                            },
                            {
                                label: "Product Color",
                                value: "productColor"
                            },
                            {
                                label: "Product Image",
                                value: "productImage"
                            },
                            {
                                label: "SKU",
                                value: "sku"
                            },
                            {
                                label: "Quantity",
                                value: "quantity"
                            },
                            {
                                label: "Price",
                                value: "price"
                            },
                            {
                                label: "Reserve Product Date",
                                value: "reserveProductDate"
                            },
                        ];
                        json2csvParser = new json2csv_1.Parser({ fields: fields });
                        csv = json2csvParser.parse(output);
                        console.log("ReserveProduct -> exportToCsv -> output", output);
                        console.log("ReserveProduct -> exportToCsv -> csv", csv);
                        return [2 /*return*/, csv];
                    case 2:
                        error_1 = _a.sent();
                        Log_1.Log.error("Error while exporting reserve producy to csv with: ", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReserveProduct.TYPE = "reserve_product";
    return ReserveProduct;
}(AbstractPersistentModel_1.AbstractPersistentModel));
exports.ReserveProduct = ReserveProduct;
