import axios from 'axios';
import { useMainStore } from '@/stores';

const MOCK_BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const getCurrentToken = () => useMainStore().getToken;
const headers = () => ({
  Authorization: `Bearer ${getCurrentToken()}`,
});

export class StandardRequest {
  static GET = (path = '', params = null) => {
    const relativePath = path ? `/${path}` : '.json';

    return axios.get(`${MOCK_BASE_URL}${relativePath}`, {
      params: { ...params },
      headers: headers(),
    });
  };

  static POST = (path, payload) => {
    return axios.post(
      `${MOCK_BASE_URL}/${path}`,
      { ...payload },
      { headers: headers() }
    );
  };

  static UPDATE = (path, payload) => {
    return axios.patch(
      `${MOCK_BASE_URL}/${path}`,
      { ...payload },
      { headers: headers() }
    );
  };

  static DELETE = (path) => {
    return axios.delete(`${MOCK_BASE_URL}/${path}`, { headers: headers() });
  };
}
