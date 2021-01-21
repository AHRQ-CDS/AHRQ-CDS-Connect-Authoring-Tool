import { SET_VSAC_API_KEY } from './types';

export function setVSACApiKey(apiKey) {
  return {
    type: SET_VSAC_API_KEY,
    apiKey
  };
}
