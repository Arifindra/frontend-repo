// src/pages/teacher/TeacherResults.jsx
import { useEffect, useState } from "react";
import { getAllResults } from "../../services/resultService";
import { getAllExams } from "../../services/examService";

const TeacherResults = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const [resultsData, examsData] = await Promise.all([
        getAllResults(),
        getAllExams(),
      ]);
      setResults(resultsData || []);
      setExams(examsData || []);
    } catch (err) {
      console.error("Error fetch results/exams:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil data hasil ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResults = selectedExamId
    ? results.filter((r) => String(r.examId) === String(selectedExamId))
    : results;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Hasil Ujian Siswa</h1>
      <p className="text-sm text-gray-600 mb-4">
        Lihat rekap nilai ujian yang sudah dikerjakan siswa.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-xs mb-1 font-semibold">
            Filter berdasarkan ujian
          </label>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            <option value="">Semua ujian</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} ({exam.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel hasil */}
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">
          Rekap Hasil ({filteredResults.length})
        </h2>

        {loading ? (
          <p className="text-xs text-gray-500">Memuat hasil ujian...</p>
        ) : filteredResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            Belum ada hasil ujian yang sesuai filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-left">Siswa</th>
                  <th className="border px-2 py-1 text-left">Email</th>
                  <th className="border px-2 py-1 text-left">Ujian</th>
                  <th className="border px-2 py-1 text-left">Mapel</th>
                  <th className="border px-2 py-1 text-center">Nilai</th>
                  <th className="border px-2 py-1 text-center">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => (
                  <tr key={r.id}>
                    <td className="border px-2 py-1">
                      {r.User?.name || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {r.User?.email || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {r.Exam?.title || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {r.Exam?.subject || "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {typeof r.score === "number"
                        ? r.score.toFixed(2)
                        : r.score}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {new Date(r.createdAt).toLocaleString()}
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

export default TeacherResults;
  