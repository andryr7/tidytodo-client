export function destroyAuthInfo(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessTokenExpiration');
  localStorage.removeItem('refreshTokenExpiration');
}
