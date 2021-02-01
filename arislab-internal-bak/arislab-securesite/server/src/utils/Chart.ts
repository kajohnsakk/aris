var moment = require('moment');

export class Chart{
    
    public static generateLineChartData(xLabelList: any, analyticsRawDataList: any, platformRawDataList: any) {
        return new Promise( async (resolve, reject) => {
            let cleanRawData: any = {};
            for (const analyticsRawDataTag in analyticsRawDataList) {
                cleanRawData = await this.cleanAnalyticsRawData(cleanRawData, analyticsRawDataTag, analyticsRawDataList[analyticsRawDataTag]);
            }
            for (const platformRawDataTag in platformRawDataList) {
                cleanRawData = await this.cleanPlatformRawData(cleanRawData, platformRawDataTag, platformRawDataList[platformRawDataTag]);
            }

            // console.log('cleanRawData ==> ', cleanRawData);
            resolve(cleanRawData);
        });
    }

    private static cleanAnalyticsRawData(cleanRawData: any, analyticsRawDataTag: string, analyticsRawData: any) {
        return new Promise((resolve, reject) => {
            for(let i=0; i<analyticsRawData.length; i++) {
                let processRawData = analyticsRawData[i];
                let dataDate = processRawData[0];
                let dataValue = processRawData[1];
                dataDate = moment(dataDate).format('YYYY-MM-DD');
            
                if( typeof cleanRawData[dataDate] === 'undefined' ) {
                    cleanRawData[dataDate] = {};
                }
                cleanRawData[dataDate][analyticsRawDataTag] = dataValue;
            }
            resolve(cleanRawData);
        });
    }

    private static cleanPlatformRawData(cleanRawData: any, platformRawDataTag: string, platformRawData: any) {
        return new Promise( async (resolve, reject) => {

            if( platformRawDataTag === 'storeList' ) {
                cleanRawData = await this.processUsersData(cleanRawData, platformRawData);
            } else if( platformRawDataTag === 'orderList' ) {
                cleanRawData = await this.processOrderData(cleanRawData, platformRawData);
            }

            resolve(cleanRawData);
        });
    }

    private static processUsersData(cleanRawData: any, platformRawData: any) {
        return new Promise( async (resolve, reject) => {

            for(let i=0; i<platformRawData.length; i++) {
                let processRawData = platformRawData[i];
                let registeredTimestamp = processRawData.createdAt;
                let registerDate = moment(registeredTimestamp).format('YYYY-MM-DD');
                cleanRawData = this.initialUserArrayData(cleanRawData, registerDate, 'registered', 0);
                cleanRawData[registerDate]['registered']+= 1;

                let verifyInfo = processRawData.verifyInfo;
                if( verifyInfo.hasOwnProperty('isVerified') && verifyInfo.isVerified ) {
                    let verifiedTimestamp = verifyInfo.verifiedAt;
                    let verifiedDate = moment(verifiedTimestamp).format('YYYY-MM-DD');
                    cleanRawData = this.initialUserArrayData(cleanRawData, verifiedDate, 'verifiedUsers', 0);
                    cleanRawData[verifiedDate]['verifiedUsers']+= 1;
                }

                if( processRawData['storeInfo']['businessProfile']['accountDetails']['businessName'].length > 0 ) {
                    cleanRawData = this.initialUserArrayData(cleanRawData, registerDate, 'connectedFacebook', 0);
                    cleanRawData[registerDate]['connectedFacebook']+= 1;
				}
            }
            
            resolve(cleanRawData);
        });
    }

    private static initialUserArrayData(cleanRawData: any, dataDate: string, dataTag: string, defaultValue: any) {
        if( typeof cleanRawData[dataDate][dataTag] === 'undefined' ) {
            cleanRawData[dataDate][dataTag] = defaultValue;
        }
        return cleanRawData;
    }

    private static processOrderData(cleanRawData: any, platformRawData: any) {
        return new Promise( async (resolve, reject) => {

            for(let reportDate in cleanRawData) {
                // cleanRawData = this.initialUserArrayData(cleanRawData, reportDate, 'activedUsers', 0);
                let flags = [];
                let uniqueStoreID = [];

                for(let i=0; i<platformRawData.length; i++) {
                    let processRawData = platformRawData[i];
                    let orderTimestamp = processRawData.orderDate;
                    let orderDate = moment(orderTimestamp).format('YYYY-MM-DD');
                    if( reportDate === orderDate ) {
                        if( flags[processRawData['storeID']]) continue;
                        flags[processRawData['storeID']] = true;
                        
                        uniqueStoreID.push(processRawData['storeID']);
                    }
                    
                }
                cleanRawData[reportDate]['activedUsers'] = uniqueStoreID.length;
            }
            
            resolve(cleanRawData);
        });
    }
}