import { StandardRequest } from '../StandardRequest';

export class RequestRevenue extends StandardRequest {
  static getExchangeRevenue = () => {
    const requestPath = `exchange/revenue.json`;
    return super.GET(requestPath);
  };

  static postExchangeRevenue = (revenue) => {
    const requestPath = `exchange/revenue.json`;
    return super.POST(requestPath, revenue);
  };
}
