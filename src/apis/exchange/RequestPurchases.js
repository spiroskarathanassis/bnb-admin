import { StandardRequest } from '../StandardRequest';

export class RequestPurchases extends StandardRequest {
  static getExchangePurchases = () => {
    const requestPath = `exchange/purchases.json`;
    return super.GET(requestPath);
  };

  static postExchangePurchases = (item) => {
    const requestPath = `exchange/purchases.json`;
    return super.POST(requestPath, item);
  };

  static updateExchangePurchases = ({ data, purchaseId }) => {
    const requestPath = `exchange/purchases/${purchaseId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteExchangePurchases = ({ purchaseId }) => {
    const requestPath = `exchange/purchases/${purchaseId}.json`;
    return super.DELETE(requestPath);
  };
}
