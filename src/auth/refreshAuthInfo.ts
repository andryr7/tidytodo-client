import axios from 'axios';
import { authInfo } from '../customTypes/authInfo';

export function refreshAuthInfo(refreshToken: string): Promise<authInfo> {
  return new Promise((resolve, reject) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + '/user/refreshtoken', {
        refreshToken: refreshToken
      })
      .then((response) => {
        resolve(response.data);
        //TODO REMOVE
        console.log('New tokens were received');
      })
      .catch((error) => {
        reject(error);
      });
  });
}
