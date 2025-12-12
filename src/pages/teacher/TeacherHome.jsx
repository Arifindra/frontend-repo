// src/pages/teacher/TeacherHome.jsx
import { useEffect, useState } from "react";
import { getTeacherDashboard } from "../../services/dashboardService";

const TeacherHome = () => {
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getTeacherDashboard();
      setStats(data.stats || null);
      setRecentResults(data.recentResults || []);
    } catch (err) {
      console.error("TeacherHome dashboard error:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal memuat data dashboard guru."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Dashboard Guru</h1>
      <p className="text-sm text-gray-600 mb-4">
        Ringkasan aktivitas ujian dan hasil siswa.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500 mb-4">Memuat data...</p>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatBox label="Ujian yang Anda buat" value={stats.myExamsCount} />
          <StatBox label="Total Soal Anda" value={stats.myQuestionsCount} />
          <StatBox label="Total Peserta" value={stats.participantsCount} />
          <StatBox label="Total Hasil Ujian" value={stats.myResultsCount} />
        </div>
      )}

      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">
          Hasil Ujian Terbaru (Ujian Anda)
        </h2>

        {recentResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            Belum ada hasil ujian untuk ujian yang Anda buat.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1 text-left">Siswa</th>
                  <th className="border px-2 py-1 text-left">Ujian</th>
                  <th className="border px-2 py-1 text-left">Mapel</th>
                  <th className="border px-2 py-1 text-center">Nilai</th>
                  <th className="border px-2 py-1 text-center">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((r) => (
                  <tr key={r.id}>
                    <td className="border px-2 py-1">
                      {r.User?.name || "-"}
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

const StatBox = ({ label, value }) => (
  <div className="border rounded-lg p-3 bg-white shadow-sm">
    <div className="text-[11px] text-gray-500 mb-1">{label}</div>
    <div className="text-lg font-bold">{value ?? 0}</div>
  </div>
);

export default TeacherHome;
