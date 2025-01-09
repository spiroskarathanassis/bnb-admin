import { StandardRequest } from './StandardRequest';

export class RequestConfig extends StandardRequest {
  static getConfig = (params = null) => {
    const requestPath = `config.json`;
    return super.GET(requestPath, params);
  };

  static updateConfig = (data) => {
    const requestPath = `config.json`;
    return super.UPDATE(requestPath, data);
  };

  static updateUserConfig = (userId, data) => {
    const requestPath = `config/app_users/${userId}.json`;
    return super.UPDATE(requestPath, data);
  };
}
