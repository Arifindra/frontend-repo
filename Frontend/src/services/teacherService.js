import api from "./api";

// --- BANK SOAL ---
export const getQuestions = async () => {
  const res = await api.get("/questions");
  return res.data;
};

export const createQuestion = async (questionData) => {
  const res = await api.post("/questions", questionData);
  return res.data;
};

export const deleteQuestion = async (id) => {
  const res = await api.delete(`/questions/${id}`);
  return res.data;
};
