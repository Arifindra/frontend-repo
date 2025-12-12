// src/services/userService.js
import api from "../api/api";

/**
 * 🔹 Ambil semua user (khusus admin)
 */
export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/**
 * 🔹 Buat user baru
 * Pastikan backend user.controller mendukung field ini:
 * { name, email, password, role, className }
 */
export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

/**
 * 🔹 Update user
 * Bisa kirim subset field: { name?, email?, role?, className?, password? }
 */
export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

/**
 * 🔹 Hapus user
 */
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
