// src/pages/student/StudentProfile.jsx
import { useEffect, useState } from "react";
import { getMyResults } from "../../services/resultService";

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Ambil user dari localStorage (sama seperti di App.jsx)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Gagal parse user dari localStorage:", e);
      }
    }

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        setErrorMsg("");
        const data = await getMyResults();
        setResults(data || []);
      } catch (err) {
        console.error("Error getMyResults:", err);
        setErrorMsg(
          err.response?.data?.message ||
            "Gagal mengambil riwayat hasil ujian."
        );
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, []);

  const formatRole = (role) => {
    if (!role) return "-";
    const upper = role.toUpperCase();
    if (upper === "SISWA" || upper === "STUDENT") return "Siswa";
    if (upper === "GURU" || upper === "TEACHER") return "Guru";
    if (upper === "ADMIN") return "Admin";
    return upper;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Profil Siswa</h1>
      <p className="text-sm text-gray-600 mb-4">
        Informasi akun dan riwayat hasil ujian Anda.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Kartu profil */}
      <div className="border rounded-lg bg-white shadow-sm p-3 mb-6 text-sm">
        <h2 className="text-sm font-semibold mb-2">Data Akun</h2>
        {!user ? (
          <p className="text-xs text-gray-500">
            Data pengguna tidak ditemukan. Silakan login ulang.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-gray-500">Nama</div>
              <div className="font-semibold">{user.name}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">Email</div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">Peran</div>
              <div>{formatRole(user.role)}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">
                Kelas (jika ada)
              </div>
              <div>{user.className || "-"}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">
                Tanggal bergabung
              </div>
              <div className="text-xs text-gray-600">
                {/* jika backend mengirim createdAt di user di localStorage, bisa dipakai.
                    kalau tidak ada, akan tampil "-" */}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Riwayat hasil ujian */}
      <div className="border rounded-lg bg-white shadow-sm p-3 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Riwayat Hasil Ujian</h2>
          <span className="text-[11px] text-gray-500">
            Total: {results.length} ujian
          </span>
        </div>

        {loadingResults ? (
          <p className="text-xs text-gray-500">Memuat data hasil...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-gray-500">
            Anda belum memiliki riwayat hasil ujian.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
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
                {results.map((r) => (
                  <tr key={r.id}>
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

        <p className="mt-2 text-[11px] text-gray-500">
          Nilai yang ditampilkan adalah nilai otomatis (pilihan ganda).
          Penilaian essay bisa disesuaikan oleh guru.
        </p>
      </div>
    </div>
  );
};

export default StudentProfile;
