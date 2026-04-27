import axios from "axios";

const authorizeAxios = axios.create();

authorizeAxios.defaults.timeout = 1000 * 60 * 10;
authorizeAxios.defaults.withCredentials = true;

authorizeAxios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

authorizeAxios.interceptors.response.use(function onFulfilled(response) {
    return response;
  }, function onRejected(error) {
    return Promise.reject(error);
  });
