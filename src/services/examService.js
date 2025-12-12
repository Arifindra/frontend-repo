// src/services/examService.js
import api from "../api/api";

/**
 * 🔹 Ambil semua ujian
 * - Admin: semua ujian
 * - Guru: ujian yang dibuat guru tersebut
 * - Siswa: ujian aktif yang boleh dia ikuti
 */
export const getAllExams = async () => {
  const res = await api.get("/exams");
  return res.data;
};

/**
 * 🔹 Ambil detail 1 ujian berdasarkan ID
 * Berisi juga daftar soal (Questions) jika backend meng-include relasinya.
 */
export const getExamById = async (id) => {
  const res = await api.get(`/exams/${id}`);
  return res.data;
};

/**
 * 🔹 Buat ujian baru (Guru / Admin)
 */
export const createExam = async (data) => {
  const res = await api.post("/exams", data);
  return res.data;
};

/**
 * 🔹 Update ujian (Guru / Admin)
 */
export const updateExam = async (id, data) => {
  const res = await api.put(`/exams/${id}`, data);
  return res.data;
};

/**
 * 🔹 Hapus ujian (Guru / Admin)
 */
export const deleteExam = async (id) => {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
};
