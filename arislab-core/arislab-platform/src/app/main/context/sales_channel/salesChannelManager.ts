import { ApiService } from '../../modules/ApiService';

export class SalesChannelManager {
    private static objSalesChannelManager = new SalesChannelManager();

    static getInstance(): SalesChannelManager {
        return SalesChannelManager.objSalesChannelManager;
    }

    public getChannelByStoreID(storeID: string) {
        return ApiService.getInstance().sendRequest("GET", "/channels/storeID/" + storeID + "/details");
    }

    public getChannelInfo(channelID: string) {
        return ApiService.getInstance().sendRequest("GET", "/channels/channelID/" + channelID + "/details");
    }

    public getConvolabChannelInfo(channelID: string) {
        return ApiService.getInstance().sendRequest("GET", "/channels/cvl-platform/channelID/" + channelID + "/details");
    }

    public updateChannel(storeID: string, body: any) {
        return ApiService.getInstance().sendRequest("POST", "/channels/storeID/" + storeID + "/update", body)
    }

    public addChannelToConvolab(channelID: string, body: any) {
        return ApiService.getInstance().sendRequest("POST", "/channels/cvl-platform/update?channelID=" + channelID, body);
    }

    public removeChannelFromConvolab(channelID: string) {
        return ApiService.getInstance().sendRequest("POST", "/channels/cvl-platform/channelID/" + channelID + "/delete");
    }

    public refreshPageList() {
        return ApiService.getInstance().sendRequest("GET", "/channels/refreshPage");
    }
}