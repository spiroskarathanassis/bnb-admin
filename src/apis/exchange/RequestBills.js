import { StandardRequest } from '../StandardRequest';

export class RequestBills extends StandardRequest {
  static getExchangeBills = () => {
    const requestPath = `exchange/bills.json`;
    return super.GET(requestPath);
  };

  static postExchangeBills = (bill) => {
    const requestPath = `exchange/bills.json`;
    return super.POST(requestPath, bill);
  };

  static updateExchangeBills = ({ data, billId }) => {
    const requestPath = `exchange/bills/${billId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteExchangeBills = ({ billId }) => {
    const requestPath = `exchange/bills/${billId}.json`;
    return super.DELETE(requestPath);
  };
}
