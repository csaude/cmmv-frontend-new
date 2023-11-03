import axios, { Axios } from 'axios';
import UsersService from 'src/services/UsersService';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';
import { LocalStorage } from 'quasar';

const { website } = useSystemUtils();

const instance = axios.create({
  baseURL: 'http://localhost:8882/api'
});
// Request interceptor for API calls
instance.interceptors.request.use(
  (request) => {
    const userloged = localStorage.getItem('user');
    request.headers = {
      Accept: 'application/json',
    };
    if (request.url === '/province' || request.url === '/district' || request.url === '/clinic')  {
      delete request.headers.Authorization;
    } else if (localStorage.getItem('id_token') != null) {
      const localuser = UsersService.getUserByUserName(String(userloged));
      request.headers['X-Auth-Token'] = ['',  localStorage.getItem('id_token')].join(' ');
    } else {
      delete request.headers.Authorization;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);


// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    console.log('Utilizador 4', userloged);
    return response;
  },
  async function (error) {
    console.log('Utilizador 5', userloged);

    const originalRequest = error.config;
    // const rToken = localStorage.getItem('id_token')
    const rToken = localStorage.getItem('refresh_token');
    if (rToken != null && rToken.length > 10) {
      if (rToken.length > 10) {
        if ((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
              originalRequest._retry = true
          console.log('attempt to refresh token here -' + 'http://dev.fgh.org.mz:4110/oauth/access_token?grant_type=refresh_token&refresh_token=' + rToken)
          return axios.post('http://dev.fgh.org.mz:4110/oauth/access_token?grant_type=refresh_token&refresh_token=' + rToken)
            .then(({ data }) => {
              console.log('==got the following token back: ' + data.access_token + '___________________________________________')
              localStorage.setItem('id_token', data.access_token)
              localStorage.setItem('refresh_token', data.access_token)
            //  axios.defaults.headers.common['X-Auth-Token'] = data.access_token
            originalRequest.headers['X-Auth-Token'] = [
              '', localStorage.getItem('id_token')
            ].join(' ')
          return axios(originalRequest)
            })
        }
      }
    }
    return Promise.reject(error);
  }
);

export default () => {
  return instance;
};
