import Axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import store from '@/store'

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL + '/api'
});

const TOKEN_REFRESH_URL = '/auth/refresh'
const LOGIN_URL = '/auth/login'

// Add Bearer token to all API requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (['get', 'post'].some(verb => verb == config.method)
    && token && token != 'null'
    && config.url != LOGIN_URL) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log({ config });
  }
  return config;
})

// Function that is auto called to refresh authorization token
const refreshAuthLogic = failedRequest => {
  if (failedRequest.config.url == LOGIN_URL) return Promise.resolve();
  axios.post(TOKEN_REFRESH_URL)
    .then(tokenRefreshResponse => {
      console.log({ tokenRefreshResponse });
      localStorage.setItem('token', tokenRefreshResponse.data.access_token);
      failedRequest.response.config.headers['Authorization'] = `Bearer ${tokenRefreshResponse.data.access_token}`;
      return Promise.resolve();
    })
};

createAuthRefreshInterceptor(axios, refreshAuthLogic)

export default axios;
