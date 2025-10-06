import axios from "axios";
import Message from "../utils/Message";
import Router from "next/router"; // useRouter o'rniga Router

// export const API_URL = "http://82.146.47.190:8001";
export const API_URL = "https://4rent.uz";
// export const API_URL = "http://45.138.158.158:9595";

const client = axios.create({
  withCredentials: false,
  baseURL: API_URL
})

client.interceptors.request.use((config) => {
  if (config.headers === undefined) {
    config.headers = {};
  }
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    
    const res = await axios.post(`${API_URL}/api/token/refresh/`, {
      refresh: refreshToken
    });
    
    const { access } = res.data;
    localStorage.setItem("access", access);
    return access;
  } catch (error) {
    console.error("Refresh token error:", error);
    // Refresh token ham eskirgan bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    Router.push("/login");
    throw error;
  }
};

// Refresh token ishlatish uchun flag
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Agar refresh token ishlatilmoqda bo'lsa, navbatga qo'shish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
