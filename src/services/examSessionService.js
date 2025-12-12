// src/services/examSessionService.js
import api from "../api/api";

// 🔹 Siswa mulai ujian -> dapet sessionId + exam (dengan soal)
export const startExamSession = async (examId) => {
  const res = await api.post("/exam-session/start", { examId });
  // backend membalas: { message, data: { sessionId, exam } }
  return res.data.data; // { sessionId, exam }
};

// 🔹 Siswa submit ujian
export const submitExam = async (payload) => {
  // payload: { sessionId, answers: [...] }
  const res = await api.post("/exam-session/submit", payload);
  return res.data; // { message, data: { finalScore } } (walaupun kita tidak pakai nilai di frontend)
};

/**
 * 🔹 Guru: ambil daftar sesi ujian untuk 1 ujian
 */
export const getExamSessionsByExam = async (examId) => {
  const res = await api.get(`/exam-session/by-exam/${examId}`);
  return res.data; // array ExamSession (include User + answers)
};