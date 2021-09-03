import axios from "axios";

const instanceAxios = {
  baseURL: process.env.REACT_APP_SERVER_API,
};

const axiosConfig = axios.create(instanceAxios);

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
