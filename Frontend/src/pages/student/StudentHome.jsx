// src/pages/student/StudentHome.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentDashboard } from "../../services/dashboardService";

const StudentHome = () => {
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getStudentDashboard();
      setStats(data.stats || null);
      setRecentResults(data.recentResults || []);
    } catch (err) {
      console.error("StudentHome dashboard error:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal memuat data dashboard siswa."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-1">Dashboard Siswa</h1>
      <p className="text-sm text-gray-600 mb-4">
        Selamat datang, {user?.name}. Silakan pilih menu atau lihat ringkasan ujian Anda.
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
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatBox label="Ujian Aktif" value={stats.availableExamsCount} />
          <StatBox label="Ujian yang Diikuti" value={stats.myExamsTaken} />
          <StatBox
            label="Rata-rata Nilai"
            value={
              typeof stats.myAverageScore === "number"
                ? stats.myAverageScore.toFixed(2)
                : "-"
            }
          />
        </div>
      )}

      {/* Navigasi cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <QuickLink
          to="/student/ujian"
          title="Kerjakan Ujian"
          desc="Lihat dan kerjakan ujian yang tersedia."
        />
        <QuickLink
          to="/student/profile"
          title="Profil & Nilai"
          desc="Lihat data akun dan hasil ujian Anda."
        />
        <QuickLink
          to="/student/bank-soal"
          title="Latihan Soal"
          desc="(Opsional) Akses soal latihan jika tersedia."
        />
      </div>

      {/* Hasil terbaru */}
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <h2 className="text-sm font-semibold mb-2">
          Hasil Ujian Terakhir
        </h2>

        {recentResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            Belum ada hasil ujian yang tercatat.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
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

const QuickLink = ({ to, title, desc }) => (
  <Link
    to={to}
    className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
  >
    <div className="text-sm font-semibold mb-1">{title}</div>
    <div className="text-xs text-gray-600">{desc}</div>
  </Link>
);

export default StudentHome;
