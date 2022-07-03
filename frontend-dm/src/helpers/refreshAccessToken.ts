import axios from "axios";
const refreshAccessToken = async () => {
  const refreshToken: string | null = localStorage.getItem("refreshToken");
  return axios
    .post(`${process.env.REACT_APP_BACKEND}/api/token`, { refreshToken })
    .then((res) => {
      return res.data.accessToken;
    })
    .catch(() => {
      return null;
    });
};
export default refreshAccessToken;
