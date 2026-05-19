import axios from "axios";
import { toast } from "react-toastify";
import { getAccessToken, refreshToken, setAccessToken } from "~/apis";

const authorizeAxios = axios.create();

authorizeAxios.defaults.timeout = 1000 * 60 * 10;
authorizeAxios.defaults.withCredentials = true;

authorizeAxios.interceptors.request.use(function (config) {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;
authorizeAxios.interceptors.response.use(function onFulfilled(response) {
    return response;
  }, async function onRejected(error) {
    const originalRequest = error.config;

    const isRefreshRequest = originalRequest?.url?.includes('/api/v1/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshToken()
            .then((response) => {
              const newAccessToken = response?.data?.accessToken;
              if (!newAccessToken) throw new Error('Refresh token failed');
              setAccessToken(newAccessToken);
              return newAccessToken;
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }

        const newAccessToken = await refreshTokenPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authorizeAxios(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);

        let refreshErrorMessage = refreshError?.message;
        if (refreshError.response?.data?.message) {
          refreshErrorMessage = refreshError.response.data.message;
        }

        toast.error(refreshErrorMessage);
        return Promise.reject(refreshError);
      }
    }

    let errorMessage = error?.message;

    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  });

export default authorizeAxios;
