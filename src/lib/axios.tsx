import axios from "axios";
import { getToken } from "next-auth/jwt";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Use 'const' for token since it will not be reassigned
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("next-auth.session-token="));
    const token = cookies ? cookies.split("=")[1] : null;

    console.log("Start the run");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
