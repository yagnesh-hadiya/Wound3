import axios from "axios";
import { getToken, removeToken } from "../helpers/tokens";
import { API_BASE_URL } from "../helpers/config";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = getToken();

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "api/account/login" && err.response) {
      if (err.response.status === 401) {
        removeToken();
        window.location.href = "./"; // Redirect to the login page
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
