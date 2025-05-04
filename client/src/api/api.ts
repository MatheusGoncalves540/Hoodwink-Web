import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:2409",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.REACT_APP_BACKEND_URL || "http://localhost:2409",
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
    if (!error.response) return Promise.reject(error);

    const { status, data: response } = error.response;

    if (status === 401) {
      window.alert("Faça Login Novamente");
      window.location.href = "/login";
    }

    if (typeof response.data?.redirectTo === "string" && response.data.redirectTo.trim() !== "") {
      window.location.href = response.data.redirectTo;
    }

    return Promise.reject(error);
  }
);

export default apiServer;
