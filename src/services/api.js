import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  // baseURL: "http://18.230.85.65:3000"
  baseURL: "http://localhost:3333",
});

api.postOrPut = (url, id, data, config = {}) => {
  const method = id ? "put" : "post";
  const apiUrl = id ? `${url}/${id}` : url;
  return api[method](apiUrl, data, config);
};

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      window.location = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
