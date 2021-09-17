import axios from "axios";
import store from "redux/store";
import { postLogin } from "redux/userReducer";
import { setLoading } from "redux/homeReducer";

const instanceAxios = {
  baseURL: process.env.REACT_APP_SERVER_API,
};

const axiosConfig = axios.create(instanceAxios);

// Add a request interceptor
axiosConfig.interceptors.request.use(
  async function (config) {
    // delay time
    await new Promise((resolve) => setTimeout(resolve, 300));
    return config;
  },
  function (error) {
    // Do something with request error
    store.dispatch(setLoading(0));
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosConfig.interceptors.response.use(
  function (response) {
    setTimeout(() => store.dispatch(setLoading(false)), 500);
    return response;
  },
  function (error) {
    if (error.response && error.response.status && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("address");
      store.dispatch(postLogin(() => true));
    }
    store.dispatch(setLoading(0));
    return Promise.reject(error);
  }
);

const request = ({ method, url, data, ...rest }) =>
  axiosConfig({
    method: method,
    url: url,
    data: data,
    ...rest,
  });

const requestToken = ({ method, url, data, ...rest }) => {
  let token = localStorage.getItem("token");

  return axiosConfig({
    method: method,
    url: url,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...rest,
  });
};

export { request, requestToken };
