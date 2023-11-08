import { axiosApiInstance } from '@data/api/axiosInstance';

export async function logout(): Promise<void> {
  //Retrieve token from local storage
  const storedRefreshToken = localStorage.getItem('refreshToken');

  //Order refresh token destruction
  axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL + '/auth/logout', {
      refreshToken: storedRefreshToken
    })
    .catch(() => {
      // console.log(err);
    });
}
