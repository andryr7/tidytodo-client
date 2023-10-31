import { authInfo } from '../customTypes/authInfo';

export function storeAuthInfo(authInfo: authInfo): void {
  const now = new Date();

  //Calculating the new expiration dates
  const accessTokenExpirationDate = new Date(
    now.getTime() + authInfo.accessTokenExpiresIn
  );
  const refreshTokenExpirationDate = new Date(
    now.getTime() + authInfo.refreshTokenExpiresIn
  );

  //Storing the token information in local storage
  localStorage.setItem(
    'accessTokenExpiration',
    accessTokenExpirationDate.toISOString()
  );
  localStorage.setItem(
    'refreshTokenExpiration',
    refreshTokenExpirationDate.toISOString()
  );
  localStorage.setItem('accessToken', authInfo.accessToken);
  localStorage.setItem('refreshToken', authInfo.refreshToken);
}
