import axios from 'axios';
import Config from '../../config';

const API_BASE = Config.api.baseUrl;

export const AUTHENTICATED = 'AUTHENTICATED';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export const CHECKING_AUTHENTICATION = 'CHECKING_AUTHENTICATION';

export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/auth/user`)
      .then(result => resolve(result.data))
      .catch(() => reject('No Authenticated User'));
  });
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/auth/login`, { username, password })
      .then((result) => resolve(result.data))
      .catch(() => reject('Authentication Failure'));
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/auth/logout`)
    .then(() => resolve())
    .catch(() => reject('Authentication Failure'));
  });
}
