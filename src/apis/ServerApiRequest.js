import axios from 'axios';
import { useMainStore } from '@/stores';

const BASE_SERVER_API = import.meta.env.VITE_SERVER_API;

const getCurrentToken = () => useMainStore().getToken;
const headers = () => ({
  Authorization: `Bearer ${getCurrentToken()}`,
});

export class ServerApiRequest {
  static GET = (path = '', params = null) => {
    return axios.get(`${BASE_SERVER_API}${path}`, {
      params: { ...params },
      headers: headers(),
    });
  };

  static POST = (path, payload) => {
    return axios.post(
      `${BASE_SERVER_API}/${path}`,
      { ...payload },
      { headers: headers() }
    );
  };

  static UPDATE = (path, payload) => {
    return axios.patch(
      `${BASE_SERVER_API}/${path}`,
      { ...payload },
      { headers: headers() }
    );
  };

  static DELETE = (path) => {
    return axios.delete(`${BASE_SERVER_API}/${path}`, { headers: headers() });
  };
}
