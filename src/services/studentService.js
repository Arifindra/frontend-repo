import api from "./api";

export const getStudentStats = async () => {
  const res = await api.get("/student/stats");
  return res.data;
};
