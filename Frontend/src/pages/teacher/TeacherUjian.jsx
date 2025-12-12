// src/pages/teacher/TeacherUjian.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
} from "../../services/examService";

const emptyForm = {
  title: "",
  description: "",
  subject: "",
  duration: 60,
  startTime: "",
  endTime: "",
  isActive: false,
  targetClass: "",
};

const TeacherUjian = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getAllExams();
      setExams(data || []);
    } catch (err) {
      console.error("Error getAllExams:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil daftar ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (exam) => {
    setEditingId(exam.id);
    setForm({
      title: exam.title || "",
      description: exam.description || "",
      subject: exam.subject || "",
      duration: exam.duration || 60,
      startTime: exam.startTime ? exam.startTime.slice(0, 16) : "",
      endTime: exam.endTime ? exam.endTime.slice(0, 16) : "",
      isActive: !!exam.isActive,
      targetClass: exam.targetClass || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus ujian ini?");
    if (!yakin) return;

    try {
      setErrorMsg("");
      setSuccessMsg("");
      await deleteExam(id);
      setSuccessMsg("Ujian berhasil dihapus.");
      fetchExams();
    } catch (err) {
      console.error("Error deleteExam:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menghapus ujian."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.title.trim() || !form.subject.trim()) {
      setErrorMsg("Judul dan mata pelajaran wajib diisi.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      subject: form.subject,
      duration: Number(form.duration) || 60,
      startTime: form.startTime ? new Date(form.startTime) : null,
      endTime: form.endTime ? new Date(form.endTime) : null,
      isActive: !!form.isActive,
      targetClass: form.targetClass || null,
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateExam(editingId, payload);
        setSuccessMsg("Ujian berhasil diperbarui.");
      } else {
        await createExam(payload);
        setSuccessMsg("Ujian baru berhasil dibuat.");
      }

      resetForm();
      fetchExams();
    } catch (err) {
      console.error("Error save exam:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan ujian."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Manajemen Ujian</h1>
      <p className="text-sm text-gray-600 mb-4">
        Buat dan kelola ujian yang akan diikuti siswa.
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

      {/* Form tambah / edit ujian */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-3 mb-6 bg-white shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {editingId ? "Edit Ujian" : "Buat Ujian Baru"}
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
              Judul Ujian
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Contoh: Ujian Akhir Semester 1"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Untuk kelas (opsional)
            </label>
            <input
              type="text"
              name="targetClass"
              value={form.targetClass}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder='Contoh: "X IPA 1"'
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Kosongkan jika ujian boleh untuk semua kelas.
            </p>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Mata Pelajaran
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Contoh: Matematika"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Durasi (menit)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              min={10}
            />
          </div>

          <div className="flex items-center gap-2 mt-5 md:mt-0">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <label
              htmlFor="isActive"
              className="text-xs font-semibold select-none"
            >
              Ujian Aktif
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Waktu Mulai (opsional)
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Waktu Selesai (opsional)
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs mb-1 font-semibold">
            Deskripsi (opsional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Informasi tambahan tentang ujian..."
          />
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
            : "Buat Ujian"}
        </button>
      </form>

      {/* Tabel daftar ujian */}
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">Daftar Ujian</h2>

        {loading ? (
          <p className="text-xs text-gray-500">Memuat ujian...</p>
        ) : exams.length === 0 ? (
          <p className="text-xs text-gray-500">
            Belum ada ujian yang dibuat.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-left">Judul</th>
                  <th className="border px-2 py-1 text-left">Mapel</th>
                  <th className="border px-2 py-1 text-left">Kelas</th>
                  <th className="border px-2 py-1 text-center">Durasi</th>
                  <th className="border px-2 py-1 text-center">Status</th>
                  <th className="border px-2 py-1 text-center">Waktu</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="border px-2 py-1">{exam.title}</td>
                    <td className="border px-2 py-1">{exam.subject}</td>
                    <td className="border px-2 py-1">
                      {exam.targetClass || "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {exam.duration} mnt
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {exam.isActive ? (
                        <span className="text-green-600 font-semibold">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-gray-500">Nonaktif</span>
                      )}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex flex-col gap-1">
                        {exam.startTime && (
                          <span className="text-[11px] text-gray-600">
                            Mulai:{" "}
                            {new Date(
                              exam.startTime
                            ).toLocaleString()}
                          </span>
                        )}
                        {exam.endTime && (
                          <span className="text-[11px] text-gray-600">
                            Selesai:{" "}
                            {new Date(
                              exam.endTime
                            ).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Link
                          to={`/teacher/ujian/${exam.id}`}
                          className="text-[11px] px-2 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                        >
                          Detail
                        </Link>
                        <button
                          className="text-[11px] px-2 py-1 rounded border border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(exam)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[11px] px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(exam.id)}
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

export default TeacherUjian;
