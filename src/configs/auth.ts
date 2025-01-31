// eslint-disable-next-line import/no-anonymous-default-export
export default {
  meEndpoint: '/api/users/view-profile',
  loginEndpoint: '/api/auth/login',
  logoutEndpoint: '/api/auth/logout',
  registerEndpoint: '/api/auth/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
