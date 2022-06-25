import axios from "axios";

const accessToken: string | null = sessionStorage.getItem("accessToken");

export const adapter = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND}`,
    headers: {
      authorization: accessToken!,
    },
  });
