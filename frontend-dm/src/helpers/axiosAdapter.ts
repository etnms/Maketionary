import axios, { AxiosInstance, AxiosResponse } from "axios";
import refreshAccessToken from "./refreshAccessToken";

const accessToken: string | null = sessionStorage.getItem("accessToken");

const adapter = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND}/api`,
  headers: {
    authorization: accessToken!,
  },
});

const createAxiosResponseIntercepter = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: any) => {
      const originalRequest = error.config;
      // prevent looping
      if (
        error.response.status === 403 &&
        originalRequest.url === `${process.env.REACT_APP_BACKEND}/api/token`
      ) {    
        return Promise.reject(error);
      }
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        adapter.interceptors.response.eject(error);
        const access_token = await refreshAccessToken();
        originalRequest.headers["authorization"] = "Bearer " + access_token;
        return adapter(originalRequest);
      }
      return Promise.reject(error);
    }
  );
};

createAxiosResponseIntercepter(adapter);
export default adapter;
