import { StandardRequest } from './StandardRequest';

export class RequestNotifications extends StandardRequest {
  static getNoties = (params = null) => {
    const requestPath = `notifications.json`;
    return super.GET(requestPath, params);
  };

  static saveNewNotification = (payload) => {
    const requestPath = `notifications.json`;
    return super.POST(requestPath, payload);
  };

  static updateNotification = ({ data, notificationId }) => {
    const requestPath = `notifications/${notificationId}.json`;
    return super.UPDATE(requestPath, data);
  };

  static deleteNotification = ({ notificationId }) => {
    const requestPath = `notifications/${notificationId}.json`;
    return super.DELETE(requestPath);
  };
}
