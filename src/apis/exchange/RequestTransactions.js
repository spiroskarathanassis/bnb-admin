import { StandardRequest } from '../StandardRequest';

export class RequestTransactions extends StandardRequest {
  static getExchangeTransactions = () => {
    const requestPath = `exchange/transactions.json`;
    return super.GET(requestPath);
  };

  static postExchangeTransactions = (transaction) => {
    const requestPath = `exchange/transactions.json`;
    return super.POST(requestPath, transaction);
  };

  static updateExchangeTransaction = ({ data, transactionId }) => {
    const requestPath = `exchange/transactions/${transactionId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteExchangeTransaction = ({ transactionId }) => {
    const requestPath = `exchange/transactions/${transactionId}.json`;
    return super.DELETE(requestPath);
  };
}
