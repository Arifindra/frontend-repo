// frontend/src/api/api.js
import axios from "axios";

// Gunakan environment variable agar fleksibel antara development & production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Kalau backend pakai cookie session, aktifkan ini:
  // withCredentials: true,
});

// ✅ Interceptor Request → Tambahkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // kalau backend kamu pakai nama header lain, contoh:
      // config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor Response → Tangani error token kadaluarsa / invalid
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
