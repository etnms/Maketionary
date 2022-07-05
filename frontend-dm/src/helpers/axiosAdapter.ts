import axios, { AxiosInstance, AxiosResponse } from "axios";
import refreshAccessToken from "./refreshAccessToken";

const accessToken: string = sessionStorage.getItem("accessToken")!;

const adapter = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}/api`,
  headers: {
    "Content-Type": "application/json",
    authorization: accessToken,
  },
});

adapter.interceptors.request.use(
  (config) => {
    config.headers!.authorization = sessionStorage.getItem("accessToken")!;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const createAxiosResponseIntercepter = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: any) => {
      const originalRequest = error.config;
      // prevent looping
      if (
        error.response.status === 401 &&
        originalRequest.url === `${process.env.REACT_APP_BACKEND}/api/token`
      ) {
        return Promise.reject(error);
      }
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        adapter.interceptors.response.eject(error);
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["authorization"] = "Bearer " + newAccessToken;
        sessionStorage.setItem("accessToken", "Bearer " + newAccessToken);
        return adapter(originalRequest);
      }
      return Promise.reject(error);
    }
  );
};

createAxiosResponseIntercepter(adapter);
export default adapter;
