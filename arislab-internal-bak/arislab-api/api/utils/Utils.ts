
const uuid = require("uuid");
const shortUuid = require("short-uuid");
const moment = require('moment-timezone');

export class Utils{
    public static generateId(){
        return shortUuid().fromUUID(uuid.v4());
    }

    public static randomString(length: Number, an: string) {
        /**
         * RANDOM STRING GENERATOR
         *
         * Info:      http://stackoverflow.com/a/27872144/383904
         * Use:       randomString(length [,"A"] [,"N"] );
         * Default:   return a random alpha-numeric string
         * Arguments: If you use the optional "A", "N" flags:
         *            "A" (Alpha flag)   return random a-Z string
         *            "N" (Numeric flag) return random 0-9 string
         */
        an = an && an.toLowerCase();
        var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
        for (; i++ < length;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }

    public static getTimestamp(takeAwayDay: number, timeLength: number = 13) {
        var date = new Date();
        date.setHours(0,0,0,0);
        date.setDate(date.getDate() - takeAwayDay);
        
        return Number( date.getTime().toString().substr(0, timeLength) );
    }
	
	public static convertArrayToJson(arrayList: any[], newIndex: string) {
		let newJson = {};
		if( arrayList.length > 0 ) {
			for(let i=0; i<arrayList.length; i++) {
				let arrayItem = arrayList[i];
				let jsonIndex = arrayItem[newIndex];
				newJson[jsonIndex] = arrayItem;
			}
		}
		
		return newJson;
	}
	
	public static checkIsExpirySoon(expiryDateTimestamp: number) {
		const limitDay = 7;
		let isExpirySoon = false;
		const processDate = Date.now();
		
		let expiryLimitDate = expiryDateTimestamp - ( 24*60*60*1000*limitDay );
		if( expiryDateTimestamp > processDate && processDate > expiryLimitDate ) {
			isExpirySoon = true;
		}
		
		return isExpirySoon;
	}
	
	public static checkIsActive(storeStatus: string, activeDate?: number, expiryDate?: number) {
		let isActive = false;
		
		if( storeStatus === "ACTIVE" ) {
			if( activeDate > 0 && expiryDate > 0 ) {
				const currentDate = Date.now();
				if( (activeDate >= currentDate) || (currentDate >= activeDate && currentDate <= expiryDate) ) {
					isActive = true;
				} else {
					isActive = false;
				}
			} else {
				isActive = true;
			}
		}
		
		return isActive;
	}
	
	public static getDisplayDate( timeStamp: number ) {
		return moment(timeStamp).tz("Asia/Bangkok").format("HH:mm")+" น.\r"+moment(timeStamp).tz("Asia/Bangkok").format("DD/MM/YYYY")
	}
	
	public static insertStorePackageToStoreObj = async (storeObj: any, jsonStorePackage: any) => {
		const storeID = storeObj['storeID'];
		if( jsonStorePackage.hasOwnProperty(storeID) ) {
			
			storeObj['storeInfo']['packageInfo'] = jsonStorePackage[storeID]['packageInfo'];
			storeObj['storeInfo']['packageInfo']['status'] = jsonStorePackage[storeID]['status'];jsonStorePackage
			storeObj['storeInfo']['packageInfo']['activeDate'] = Utils.getDisplayDate(jsonStorePackage[storeID]['activeDate']);
			storeObj['storeInfo']['packageInfo']['expiryDate'] = Utils.getDisplayDate(jsonStorePackage[storeID]['expiryDate']);
			
			/*
			let expiryLimitDate = jsonStorePackage[storeID]['expiryDate'] - ( 24*60*60*1000*limitDay );
			if( Date.now() > expiryLimitDate ) {
				storeObj['storeInfo']['packageInfo']['isExpirySoon'] = true;
			} else {
				storeObj['storeInfo']['packageInfo']['isExpirySoon'] = false;
			}
			*/
			
			storeObj['storeInfo']['packageInfo']['isExpirySoon'] = Utils.checkIsExpirySoon(jsonStorePackage[storeID]['expiryDate']);
		}
		return Promise.resolve(storeObj);
	}
	
	public static createStorePackageToStoreObj(storeList: any[], storePackageList: any[]) {
		let jsonStorePackage = this.convertArrayToJson(storePackageList, "storeID");
		return Promise.all(storeList.map(storeObj => this.insertStorePackageToStoreObj(storeObj, jsonStorePackage)));
	}
	
	public static createSummaryStorePackageData(storePackage: any) {
		let summaryObj = {
			activeDate: '',
			expiryDate: '',
			isActive: false,
			isExpirySoon: false
		};
		
		summaryObj['activeDate'] = this.getDisplayDate(storePackage['activeDate']);
		summaryObj['expiryDate'] = this.getDisplayDate(storePackage['expiryDate']);
		summaryObj['isActive'] = this.checkIsActive(storePackage['status'], storePackage['activeDate'], storePackage['expiryDate']);
		summaryObj['isExpirySoon'] = ( storePackage['status'] === "ACTIVE" ) ? this.checkIsExpirySoon(storePackage['expiryDate']) : false ;
		
		storePackage['summaryObj'] = summaryObj;
		return Promise.resolve(storePackage);
	}
	
	public static processStorePackageList(storePackageList: any[]) {
		return Promise.all(storePackageList.map(storePackage => this.createSummaryStorePackageData(storePackage)));
	}

	public static findObjectInArray(targetArray: any[], indexName: string, value: string) {
		let returnArray = [];
		for(let i=0; i<targetArray.length; i++) {
			if( targetArray[i][indexName] === value ) {
				returnArray.push(targetArray[i]);
			}
		}
		return returnArray;
	}
	
}