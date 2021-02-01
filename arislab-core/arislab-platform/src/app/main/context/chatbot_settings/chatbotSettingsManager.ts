import { ApiService } from '../../modules/ApiService';

export class ChatbotSettingsManager {
    private static objChatbotSettingsManager = new ChatbotSettingsManager();

    static getInstance(): ChatbotSettingsManager {
        return ChatbotSettingsManager.objChatbotSettingsManager;
    }

    public getChatbotConfig(storeID: string) {
        return ApiService.getInstance().sendRequest("GET", "/chatbot/storeID/" + storeID + "/details");
    }

    public saveChatbotConfig(storeID: string, body: object) {
        return ApiService.getInstance().sendRequest("POST", "/chatbot/storeID/" + storeID + "/update", body)
    }
}