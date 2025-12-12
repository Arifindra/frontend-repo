// src/pages/admin/AdminHasil.jsx
import { useEffect, useMemo, useState } from "react";
import { getAllResults } from "../../services/resultService";

const AdminHasil = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [examFilter, setExamFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getAllResults();
      setResults(data || []);
    } catch (err) {
      console.error("Error getAllResults:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil data hasil ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Kumpulan ujian unik untuk filter
  const examOptions = useMemo(() => {
    const map = new Map();
    results.forEach((r) => {
      if (r.Exam) {
        map.set(r.Exam.id, r.Exam);
      }
    });
    return Array.from(map.values());
  }, [results]);

  // Kumpulan kelas unik untuk filter
  const classOptions = useMemo(() => {
    const set = new Set();
    results.forEach((r) => {
      if (r.User?.className) {
        set.add(r.User.className);
      }
    });
    return Array.from(set);
  }, [results]);

  // Filter data
  const filteredResults = results.filter((r) => {
    if (examFilter !== "ALL" && r.Exam?.id !== Number(examFilter)) {
      return false;
    }

    if (
      classFilter !== "ALL" &&
      (r.User?.className || "") !== classFilter
    ) {
      return false;
    }

    const q = search.toLowerCase();
    if (!q) return true;

    return (
      r.User?.name?.toLowerCase().includes(q) ||
      r.User?.email?.toLowerCase().includes(q) ||
      r.Exam?.title?.toLowerCase().includes(q) ||
      r.Exam?.subject?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Hasil Ujian</h1>
      <p className="text-sm text-gray-600 mb-4">
        Pantau nilai ujian siswa berdasarkan ujian, kelas, dan filter
        lainnya.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Filter bar */}
      <div className="border rounded-lg bg-white shadow-sm p-3 mb-4 text-xs flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div>
            <span className="block text-[11px] text-gray-600 mb-1">
              Filter Ujian
            </span>
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="ALL">Semua ujian</option>
              {examOptions.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-gray-600 mb-1">
              Filter Kelas
            </span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="ALL">Semua kelas</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 md:mt-0">
          <span className="block text-[11px] text-gray-600 mb-1">
            Cari siswa / ujian
          </span>
          <input
            type="text"
            placeholder="Nama siswa, email, judul ujian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-xs w-52"
          />
        </div>
      </div>

      {/* Tabel hasil */}
      <div className="border rounded-lg bg-white shadow-sm p-3 text-xs">
        {loading ? (
          <p className="text-xs text-gray-500">Memuat data hasil...</p>
        ) : filteredResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            Tidak ada data hasil ujian yang cocok dengan filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-left">Siswa</th>
                  <th className="border px-2 py-1 text-left">Kelas</th>
                  <th className="border px-2 py-1 text-left">
                    Ujian / Mapel
                  </th>
                  <th className="border px-2 py-1 text-center">
                    Nilai
                  </th>
                  <th className="border px-2 py-1 text-center">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => (
                  <tr key={r.id}>
                    <td className="border px-2 py-1">
                      <div className="font-semibold">
                        {r.User?.name || "-"}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {r.User?.email}
                      </div>
                    </td>
                    <td className="border px-2 py-1">
                      {r.User?.className || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      <div>{r.Exam?.title || "-"}</div>
                      <div className="text-[10px] text-gray-500">
                        {r.Exam?.subject}
                      </div>
                    </td>
                    <td className="border px-2 py-1 text-center font-semibold">
                      {typeof r.score === "number"
                        ? r.score.toFixed(2)
                        : "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {r.createdAt
                        ? new Date(
                            r.createdAt
                          ).toLocaleDateString()
                        : "-"}
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

export default AdminHasil;
