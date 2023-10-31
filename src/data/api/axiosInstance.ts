import axios from 'axios';
import { refreshAuthInfo } from '@auth/refreshAuthInfo';
import { destroyAuthInfo } from '@auth/destroyAuthInfo';
import { storeAuthInfo } from '@auth/storeAuthInfo';

export const axiosApiInstance = axios.create();

// //TODO REMOVE - test interceptor
// axiosApiInstance.interceptors.request.use(
//   async config => {
//     const storedAccessToken = localStorage.getItem('accessToken');
//     config.headers.Authorization = `Bearer ${storedAccessToken}`;
//     return config
//   }
// )

//Checking the credentials before every request
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedAccessTokenExpiration = localStorage.getItem('accessTokenExpiration');
    const storedRefreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
    const retrievedAccessTokenExpiration = new Date(storedAccessTokenExpiration!);
    const retrievedRefreshTokenExpiration = new Date(storedRefreshTokenExpiration!);
    const now = new Date();

    //If a token or expiration is missing in local storage, redirect to signup page
    if (storedAccessToken === null || storedRefreshToken === null) {
      // console.log('Tokens or expirations are invalid, redirecting to signup');
      //Redirecting to signup page
      window.location.href = '/signup';
      return Promise.reject(config);
    }

    if (retrievedAccessTokenExpiration < now) {
      //If the accesstoken is expired
      // console.log('Access token is expired');
      if (retrievedRefreshTokenExpiration < now) {
        // console.log('Refresh token is expired, redirecting to login');
        //If both tokens are expired, destroy them and redirect to login page
        //TODO React strict mode makes the following code and redirection fail, as tokens are checked twice and the tokens are deleted on second check
        destroyAuthInfo();
        window.location.href = '/login';
        return Promise.reject(config);
      } else {
        //refresh token
        const authInfo = await refreshAuthInfo(storedRefreshToken);

        //TODO Find a way to make authData error type match needed storea

        //Storing new auth info
        storeAuthInfo(authInfo);

        //Configuring axios to use new auth info
        config.headers.Authorization = `Bearer ${authInfo.accessToken}`;

        // console.log('New tokens were stored');
        return Promise.resolve(config);
      }
    } else {
      // console.log('Access token is valid, sending request');
      //If the access token is not expired, set the access token as auth and process the request normally
      config.headers.Authorization = `Bearer ${storedAccessToken}`;
      return Promise.resolve(config);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    //If there is no problem with request and response
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 457 && !originalRequest._retry) {
      // console.log('access token must be refreshed');

      //Getting the refresh token from localStorage
      const storedRefreshToken = localStorage.getItem('refreshToken');

      //Fetching new credentials
      const authInfo = await refreshAuthInfo(storedRefreshToken!);

      //Storing new auth info
      storeAuthInfo(authInfo);

      //Specifying in the request that it is a retry
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${authInfo.accessToken}`;

      //Retrying to send the request with renewed access token
      return axiosApiInstance(originalRequest);
    } else {
      //If a retry with new credentials has already been done, or if there is another type of error
      return Promise.reject(error);
    }
  }
);
