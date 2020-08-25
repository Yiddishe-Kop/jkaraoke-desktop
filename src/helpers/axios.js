import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL + '/api'
});

export default axios;
