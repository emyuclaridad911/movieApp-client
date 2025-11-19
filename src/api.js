import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MOVIEAPP_API, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!config.url.includes("/login") && !config.url.includes("/register") && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;