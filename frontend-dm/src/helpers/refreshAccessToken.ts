import axios from "axios";
const refreshAccessToken = async () => {
  const refreshToken: string | null = localStorage.getItem("refreshToken");
  return axios
    .post(`${process.env.REACT_APP_BACKEND}/api/token`, { refreshToken })
    .then((res) => {
      sessionStorage.setItem("accessToken", `Bearer ${res.data.accessToken}`);
      return res.data.accessToken;
    })
    .catch((err) => {
      return null;
    });
};
export default refreshAccessToken;
