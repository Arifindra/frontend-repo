// src/pages/student/StudentResults.jsx
import { useEffect, useState } from "react";
import { getMyResults } from "../../services/resultService";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getMyResults();
      setResults(data || []);
    } catch (err) {
      console.error("Error getMyResults:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil hasil ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Hasil Ujian Saya</h1>
      <p className="text-sm text-gray-600 mb-4">
        Rekap nilai ujian yang sudah Anda kerjakan.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Memuat hasil...</div>
      ) : results.length === 0 ? (
        <div className="text-sm text-gray-500">
          Belum ada hasil ujian.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1 text-left">Ujian</th>
                <th className="border px-2 py-1">Mapel</th>
                <th className="border px-2 py-1">Nilai</th>
                <th className="border px-2 py-1">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="border px-2 py-1">
                    {r.Exam?.title || "-"}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {r.Exam?.subject || "-"}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {r.score?.toFixed ? r.score.toFixed(2) : r.score}
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
  );
};

export default StudentResults;
ss