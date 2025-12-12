// src/services/dashboardService.js
import api from "../api/api";

// 🔹 Dashboard ADMIN
export const getAdminDashboard = async () => {
  const res = await api.get("/dashboard/admin");
  return res.data;
};

// 🔹 Dashboard GURU
export const getTeacherDashboard = async () => {
  const res = await api.get("/dashboard/teacher");
  return res.data;
};

// 🔹 Dashboard SISWA
export const getStudentDashboard = async () => {
  const res = await api.get("/dashboard/student");
  return res.data;
};
