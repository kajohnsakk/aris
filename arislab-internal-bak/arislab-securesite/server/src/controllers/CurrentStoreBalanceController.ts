import { storage_v1beta2 } from "googleapis";
import { FundTransaction } from "../models/FundTransaction";
import { StoreV2 } from "../models/StoreV2";

const fundTransaction = new FundTransaction();
const Store = new StoreV2();

export default class CurrentStoreBalanceController {
  constructor() {}

  getStoreWithdrawSummary(storeID?: string) {
    return fundTransaction.getWithdrawSummaryByStoreID(storeID);
  }

  getStoreDepositSummary(storeID?: string) {
    return fundTransaction.getDepositSummaryByStoreID(storeID);
  }

  async calculateCurrentBalance(storeID: string) {
    const depositSummaryResponse = await this.getStoreDepositSummary(storeID);
    const depositSummary = depositSummaryResponse.aggregations.summary.value;

    const withdrawSummaryResponse = await this.getStoreWithdrawSummary(storeID);
    const withdrawSummary = withdrawSummaryResponse.aggregations.summary.value;

    const currentBalance = depositSummary - withdrawSummary;

    return {
      currentBalance: currentBalance.toFixed(3) || 0,
      depositSummary: depositSummary.toFixed(3) || 0,
      withdrawSummary: withdrawSummary.toFixed(3) || 0,
    };
  }

  async storeBalances(req: any, res: any) {
    try {
      req.setTimeout(600000);

      const { from = 0, size = 10000 } = req.query;
      const _slef = this;
      const storeListResponse = await Store.getStoreList(from, size);

      const storeList: any = [];
      const stores = storeListResponse.hits.hits;

      const recursive = async (index: any, storeLength: any) => {
        if (index === storeLength) {
          const allStoreDepositSummaryResponse = await this.getStoreDepositSummary();
          const allStoreWithdrawSummaryResponse = await this.getStoreWithdrawSummary();

          const allStoreDepositSummary =
            allStoreDepositSummaryResponse.aggregations.summary.value;
          const allStoreWithdrawSummary =
            allStoreWithdrawSummaryResponse.aggregations.summary.value;

          res.render("reports/current-store-balance/index", {
            data: storeList,
            total: storeList.length,
            allStoreDepositSummary,
            allStoreWithdrawSummary,
            currentBalance: allStoreDepositSummary - allStoreWithdrawSummary,
          });

          return;
        }

        const storeInfo = {
          storeInfo: stores[index]._source.storeInfo,
          balanceInfo: await _slef.calculateCurrentBalance(stores[index]._id),
        };
        storeList.push(storeInfo);
        recursive((index += 1), storeLength);
      };

      recursive(0, stores.length);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
