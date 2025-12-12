// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

const emptyForm = {
  name: "",
  email: "",
  role: "SISWA",
  className: "",
  password: "",
};

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "GURU", label: "Guru" },
  { value: "SISWA", label: "Siswa" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Error getAllUsers:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil daftar user."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: (user.role || "SISWA").toUpperCase(),
      className: user.className || "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus user ini? Data tidak dapat dikembalikan."
    );
    if (!yakin) return;

    try {
      setErrorMsg("");
      setSuccessMsg("");
      await deleteUser(id);
      setSuccessMsg("User berhasil dihapus.");
      fetchUsers();
    } catch (err) {
      console.error("Error deleteUser:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menghapus user."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Nama dan email wajib diisi.");
      return;
    }

    if (!editingId && !form.password.trim()) {
      setErrorMsg("Password wajib diisi untuk user baru.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.toUpperCase(),
      className: form.className || null,
    };

    // Jika admin isi password (baik create maupun update), kirim
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateUser(editingId, payload);
        setSuccessMsg("User berhasil diperbarui.");
      } else {
        await createUser(payload);
        setSuccessMsg("User baru berhasil dibuat.");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Error save user:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data user."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      (u.className || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Manajemen Pengguna</h1>
      <p className="text-sm text-gray-600 mb-4">
        Kelola akun admin, guru, dan siswa, termasuk kelas dan role.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-3 text-sm text-green-700 border border-green-300 bg-green-50 rounded px-3 py-2">
          {successMsg}
        </div>
      )}

      {/* Form tambah / edit user */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-3 mb-6 bg-white shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {editingId ? "Edit User" : "Buat User Baru"}
          </h2>
          {editingId && (
            <button
              type="button"
              className="text-xs text-blue-600 underline"
              onClick={resetForm}
            >
              Buat baru
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Kelas (untuk siswa)
            </label>
            <input
              type="text"
              name="className"
              value={form.className}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder='Contoh: "X IPA 1"'
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Boleh dikosongkan untuk admin dan guru.
            </p>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              {editingId ? "Password baru (opsional)" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder={
                editingId
                  ? "Isi jika ingin mengganti password"
                  : "Minimal 6 karakter"
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-60"
        >
          {saving
            ? "Menyimpan..."
            : editingId
            ? "Simpan Perubahan"
            : "Buat User"}
        </button>
      </form>

      {/* Tabel daftar user */}
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h2 className="text-sm font-semibold">Daftar Pengguna</h2>
          <input
            type="text"
            placeholder="Cari nama, email, role, kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-xs w-52"
          />
        </div>

        {loading ? (
          <p className="text-xs text-gray-500">Memuat pengguna...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-xs text-gray-500">
            Tidak ada user yang cocok dengan filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-left">Nama</th>
                  <th className="border px-2 py-1 text-left">Email</th>
                  <th className="border px-2 py-1 text-left">Role</th>
                  <th className="border px-2 py-1 text-left">Kelas</th>
                  <th className="border px-2 py-1 text-center">Dibuat</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="border px-2 py-1">{u.name}</td>
                    <td className="border px-2 py-1">{u.email}</td>
                    <td className="border px-2 py-1">
                      {(u.role || "").toUpperCase()}
                    </td>
                    <td className="border px-2 py-1">
                      {u.className || "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          className="text-[11px] px-2 py-1 rounded border border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[11px] px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(u.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
