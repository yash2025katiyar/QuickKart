import axios from "axios";

// Central Axios instance:
// - withCredentials sends the httpOnly JWT cookie automatically
// - Authorization header fallback is attached for clients using bearer tokens
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("quickkart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handling -> force logout on the client
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("quickkart_token");
      localStorage.removeItem("quickkart_user");
    }
    return Promise.reject(error);
  }
);

export default API;
