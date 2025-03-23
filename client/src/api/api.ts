import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.REACT_APP_URL || "http://localhost:2409",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiServer.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.alert("Faça Login Novamente");
      document.cookie = "jwt=; Max-Age=0";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiServer;
