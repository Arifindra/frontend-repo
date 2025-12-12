// src/services/resultService.js
import api from "../api/api";

/**
 * 🔹 Admin / Guru → Ambil semua hasil ujian
 */
export const getAllResults = async () => {
  const res = await api.get("/results");
  return res.data;
};

/**
 * 🔹 Siswa → Ambil hasil ujian milik sendiri
 * Backend route: GET /api/results/my
 */
export const getMyResults = async () => {
  const res = await api.get("/results/my");
  return res.data;
};
