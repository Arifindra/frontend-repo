// src/services/questionService.js
import api from "../api/api";

// 🔹 Ambil semua soal (bisa difilter di backend per guru)
export const getAllQuestions = async () => {
  const res = await api.get("/questions");
  return res.data;
};

// 🔹 Ambil soal per ujian tertentu (kalau backend punya endpoint khusus)
export const getQuestionsByExam = async (examId) => {
  const res = await api.get(`/questions?examId=${examId}`);
  return res.data;
};

// 🔹 Tambah soal manual
export const createQuestion = async (data) => {
  const res = await api.post("/questions", data);
  return res.data;
};

// 🔹 Upload soal via Excel
export const uploadQuestionsExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/questions/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 Hapus soal
export const deleteQuestion = async (id) => {
  const res = await api.delete(`/questions/${id}`);
  return res.data;
};
