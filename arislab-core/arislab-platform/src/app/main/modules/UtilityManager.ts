import { ApiService } from './ApiService';
import { ExternalProxy } from './ExternalProxy';

export class UtilityManager {
    private static objUtilityManager = new UtilityManager();
    private MANAGE_URL = process.env.REACT_APP_MANAGE_URL || "https://manage.arislab.ai";

    static getInstance(): UtilityManager {
        return UtilityManager.objUtilityManager;
    }

    public decryptEmail(encryptedEmail: string) {
        return ApiService.getInstance().sendRequest("GET", "/utility/emailDecoder/encodedEmail/" + encryptedEmail).then((result: any) => {
            return result;
        });
    }

    public getStoreIDByEmail(email: string) {
        return ApiService.getInstance().sendRequest("GET", "/utility/storeIDLookup/email/" + email).then((resultStoreIDByEmail: any) => {
            return resultStoreIDByEmail;
        })
    }

    public storeInfoLookup(auth0_uid: string) {
        return ApiService.getInstance().sendRequest("GET", `/utility/storeInfoLookup?auth0_uid=${auth0_uid}`).then((result: any) => {
            if (typeof result === 'undefined' || result.length === 0) {
                window.location.href = 'login/'
            }
            return result;
        });
    }

    public getEventInfoByCode(eventCode: string) {
        return ApiService.getInstance().sendRequest("GET", "/event/code/" + eventCode + "/").then((resultEventInfoByCode: any) => {
            return resultEventInfoByCode;
        })
    }

    public getDefaultGBPayToken() {
        return ApiService.getInstance().sendRequest("GET", "/utility/getDefaultGBPayToken").then((result: any) => {
            return result;
        });
    }

    public checkPinCode(pinCode: string) {
        return ApiService.getInstance().sendRequest("GET", "/utility/storeIDLookup/pinCode/" + pinCode).then((result: any) => {
            return result;
        });
    }

    // public storeInfoLookup(encryptedEmail: string,) {
    //     return ApiService.getInstance().sendRequest("GET", `/utility/storeInfoLookup?encodedEmail=${encryptedEmail}`).then((result: any) => {
    //         if( typeof result === 'undefined' || result.length === 0 ) {
    //             window.location.href = 'login/'
    //         }
    //         return result;
    //     });
    // }

    public checkVerifiedBankAccount(bankCode: string, accountNumber: string) {
        return ApiService.getInstance().sendRequest("GET", "/utility/storeIDLookup/bankCode/" + bankCode + "/accountNumber/" + accountNumber).then((result: any) => {
            return result;
        });
    }

    public getLastEventTransactionByCode(eventCode: string) {
        return ApiService.getInstance().sendRequest("GET", "/eventTransaction/code/" + eventCode + "/last").then((resultLastEventTransactionByCode: any) => {
            return resultLastEventTransactionByCode;
        })
    }

    public getStorePackageList() {
        return ExternalProxy.getInstance().sendRequest({
            method: "GET",
            uri: `${this.MANAGE_URL}/getPlatformPackage`,
            json: true
        }).then((resultGetStorePackageList: { [key: string]: any }) => {
            return resultGetStorePackageList;
        })
    }

    public calculateStorePackage(selectedPackageObj: { [key: string]: any }, currentPackageObj: { [key: string]: any }, isActiveNow: boolean) {
        return ExternalProxy.getInstance().sendRequest({
            method: "POST",
            uri: `${this.MANAGE_URL}/calculateStorePackage`,
            json: true,
            body: { newPackageObj: selectedPackageObj, currentPackageObj: currentPackageObj, isActiveNow: isActiveNow }
        }).then((resultCalculateStorePackage: { [key: string]: any }) => {
            return resultCalculateStorePackage;
        })
    }

    public inactiveStorePackage(storePackageObj: { [key: string]: any }) {
        const storePackageID = storePackageObj.storePackageID;
        storePackageObj.status = "INACTIVE";
        storePackageObj.updatedAt = Date.now();
        return ApiService.getInstance().sendRequest("POST", "/storePackage/storePackageID/" + storePackageID + "/update", storePackageObj).then((resultInactiveStorePackage: { [key: string]: any }) => {
            return resultInactiveStorePackage;
        })
    }

    public insertStorePackage(storeID: string, selectedPackageObj: any, createdAt: number, caculatePackageObj: { [key: string]: any }) {
        let storePackageObj = {
            storeID: storeID,
            packageInfo: selectedPackageObj,
            status: "ACTIVE",
            createdAt: createdAt,
            updatedAt: 0,
            activeDate: caculatePackageObj.activeDate,
            expiryDate: caculatePackageObj.expiryDate
        };

        return ApiService.getInstance().sendRequest("POST", "/storePackage/new", storePackageObj).then((resultInsertStorePackage: { [key: string]: any }) => {
            return resultInsertStorePackage;
        })
    }

    public insertCreditCard(storeID: string, creditCardInfo: { [key: string]: any }) {
        const dataObj = {
            storeID: storeID,
            creditCardInfo: creditCardInfo
        };
        return ApiService.getInstance().sendRequest("POST", "/creditCard/new", dataObj).then((resultInsertCreditCard: { [key: string]: any }) => {
            return resultInsertCreditCard;
        });
    }

    public deleteCreditCard(creditCardInfo: { [key: string]: any }) {
        const dataObj = {
            creditCardInfo: creditCardInfo
        };
        return ApiService.getInstance().sendRequest("POST", "/creditCard/delete", dataObj).then((resultDeleteCreditCard: { [key: string]: any }) => {
            return resultDeleteCreditCard;
        })
    }

    public getCurrentCreditCard(storeID: string) {

        return ApiService.getInstance().sendRequest("GET", `/creditCard/storeID/${storeID}/current`).then((resultCurrentCreditCard: { [key: string]: any }) => {
            return resultCurrentCreditCard;
        })
    }

    public insertRecurring(creditCardInfo: { [key: string]: any }, chargePrice: { [key: string]: any }, selectedPackage: { [key: string]: any }, isDowngradePackage: boolean) {
        const dataObj = {
            creditCardInfo: creditCardInfo,
            chargePrice: chargePrice,
            selectedPackage: selectedPackage,
            isDowngradePackage: isDowngradePackage
        };
        return ApiService.getInstance().sendRequest("POST", "/creditCard/recurring", dataObj).then((resultInsertRecurring: { [key: string]: any }) => {
            return resultInsertRecurring;
        });
    }

    public getNextStorePackage(storeID: string) {

        return ApiService.getInstance().sendRequest("GET", `/storePackage/storeID/${storeID}/next`).then((resultNextStorePackage: { [key: string]: any }) => {
            return resultNextStorePackage;
        })
    }

    public updateSectionRecurringInfo(recurringID: string, sections: string, updateData: { [key: string]: any}) {
        const dataObj = {
            data: updateData
        };
        return ApiService.getInstance().sendRequest("POST", `/recurring/recurringID/${recurringID}/sections/${sections}/update`, dataObj).then((resultupdateSectionRecurringInfo: { [key: string]: any }) => {
            return resultupdateSectionRecurringInfo;
        })
    }
}