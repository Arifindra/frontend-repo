// frontend/src/api/api.js
import axios from "axios";

// Base API URL (ambil dari Vercel env)
const API_BASE = import.meta.env.VITE_API_BASE || "https://backend-repo-kxhr.onrender.com";

const api = axios.create({
  baseURL: API_BASE, // Tidak perlu /api kalau backend kamu bukan prefiks /api
  headers: {
    "Content-Type": "application/json",
  },
  // Jika memakai cookie session:
  // withCredentials: true,
});

// ✅ Interceptor Request → Tambahkan JWT jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor Response → Tangani token kadaluarsa
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
