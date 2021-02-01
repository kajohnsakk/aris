import TagManager from 'react-gtm-module';
import axios from "axios";
import * as AppConfig from "../../../app/main/config/AppConfig";

const host = AppConfig.API_URL;
export default class UtilityFunction {

    static useMediaQuery(mediaQueryStr) {
        return window.matchMedia(mediaQueryStr.replace("@media ", "")).matches;
    }

    static getExistValue(parameter, defaultValue) {
        let returnValue;

        if (parameter) {
            if (typeof parameter === "string" && parameter.length === 0) {
                returnValue = defaultValue;
            } else {
                returnValue = parameter;
            }
        } else {
            returnValue = defaultValue;
        }

        return returnValue;

    }

    static tagManagerPushDataLayer(pageCategory, pageAction, pageLabel, pageUser) {
        let ref = localStorage.getItem('ref_source') || "Organic";

        TagManager.dataLayer({
            dataLayer: {
                event: 'ARIS',
                pageCategory: pageCategory,
                pageAction: pageAction,
                pageLabel: pageLabel,
                pageUser: pageUser,
                referenceSource: ref
            }
        });

    }

    static getProductPrice(productObj) {

        let minPrice = Number.MAX_SAFE_INTEGER;
        let maxPrice = 0;

        if (productObj.individualProductType === 'SINGLE' || productObj.individualProductType === 'VOUCHER') {
            minPrice = Math.min(minPrice, productObj.productUniversalInfo.price);
            maxPrice = Math.max(maxPrice, productObj.productUniversalInfo.price);
        } else if (productObj.individualProductType === 'MULTI' || productObj.individualProductType === 'COLOR_ONLY') {
            productObj.productVariations.forEach(variation => {

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

    static getProductStock(productObj) {
        let totalStock = 0;
        let stock = 0

        if (productObj.individualProductType === 'SINGLE' || productObj.individualProductType === 'VOUCHER') {
            let leftStock = Number(productObj.productUniversalInfo.stock)
            let startingStock = Number(productObj.productUniversalInfo.startingStock)
            if (isNaN(startingStock))
                totalStock += leftStock
            else
                totalStock += startingStock
            stock += leftStock
        } else if (productObj.individualProductType === 'MULTI' || productObj.individualProductType === 'COLOR_ONLY') {
            productObj.productVariations.forEach(variation => {

                if (variation && variation.hasOwnProperty('size')) {
                    const sizeNames = Object.keys(variation.size);
                    for (let sizeName of sizeNames) {
                        if (variation.size[sizeName].value.hasOwnProperty('isNotAvailable') && variation.size[sizeName].value.isNotAvailable === false) {
                            let leftStock = Number(variation.size[sizeName].value.stock);
                            let startingStock = Number(variation.size[sizeName].value.startingStock)
                            if (isNaN(startingStock))
                                totalStock += leftStock
                            else
                                totalStock += startingStock
                            stock += leftStock
                        }
                    }
                }
            });
        }
        return stock + "/" + totalStock;
    };

    static async sendPaymentInfo(accountName, accountNumber, bankLabel, backupPaymentData = null) {

        var emailText = '';
        var isSendEmail = false;
        if (backupPaymentData) {
            if (backupPaymentData.hasOwnProperty('bankName') && backupPaymentData.hasOwnProperty('accountName') && backupPaymentData.hasOwnProperty('accountNumber')) {
                if (backupPaymentData.accountNumber !== accountNumber) {
                    isSendEmail = true;
                    emailText = "รบกวนช่วยเปลี่ยนข้อมูลบัญชีธนาคาร\n";
                    emailText += "จาก\nชื่อ: " + backupPaymentData.accountName + "\nเลขบัญชี: " + backupPaymentData.accountNumber + "\nธนาคาร: " + backupPaymentData.bankName + "\n\n";
                    emailText += "เป็น\nชื่อ: " + accountName + "\nเลขบัญชี: " + accountNumber + "\nธนาคาร: " + bankLabel + "\n\nของ Merchant ID: gbp0964\nMerchant Name: เอริส แล็บ จำกัด\n\n\n\nE-mail ฉบับนี้ถูกสร้างจากระบบอัตโนมัติ ไม่ต้องตอบกลับ";
                }
            }
        } else {
            isSendEmail = true;
            emailText = "รบกวนช่วย verify บัญชีธนาคาร\nชื่อ: " + accountName + "\nเลขบัญชี: " + accountNumber + "\nธนาคาร: " + bankLabel + "\n\nของ Merchant ID: gbp0964\nMerchant Name: เอริส แล็บ จำกัด\n\n\n\nE-mail ฉบับนี้ถูกสร้างจากระบบอัตโนมัติ ไม่ต้องตอบกลับ";
        }

        if (isSendEmail) {
            let emailData = {
                to: process.env.REACT_APP_TO_GBPAY_EMAIL || "admin@arislab.ai",
                from: "it@arislab.ai",
                text: emailText
            }
            await axios.post(host + "email/send", emailData);
        }

    }

    static convertDate(time) {
        const date = new Date(time);
        var newDate = date
            .toISOString()
            .split("T")[0]
            .split("-");
        newDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0][2] + newDate[0][3];
        return newDate;
    }

    static sortObjectByKeys(obj) {
        var key = Object.keys(obj).sort(function order(key1, key2) {
            if (key1 < key2) return -1;
            else if (key1 > key2) return +1;
            else return 0;
        });

        // Taking the object in 'temp' object 
        // and deleting the original object. 
        var temp = {};

        for (let i = 0; i < key.length; i++) {
            temp[key[i]] = obj[key[i]];
            delete obj[key[i]];
        }

        // Copying the object from 'temp' to  
        // 'original object'. 
        for (let i = 0; i < key.length; i++) {
            obj[key[i]] = temp[key[i]];
        }
        return obj;
    }

    static validateStringData(validateType, data) {
        const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validateResult = true;

        if (validateType === "EMAIL") {
            validateResult = emailValidator.test(data);
        }

        return validateResult;
    }
}