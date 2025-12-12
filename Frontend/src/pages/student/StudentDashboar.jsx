// src/pages/student/StudentDashboard.jsx
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-2">
        Dashboard Siswa
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Selamat datang, {user?.name}. Silakan pilih menu di bawah ini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/student/exams"
          className="border rounded-lg p-4 shadow-sm hover:shadow transition bg-white"
        >
          <h2 className="font-semibold mb-1 text-sm">Ujian Saya</h2>
          <p className="text-xs text-gray-600">
            Lihat ujian yang tersedia dan kerjakan sekarang.
          </p>
        </Link>

        <Link
          to="/student/results"
          className="border rounded-lg p-4 shadow-sm hover:shadow transition bg-white"
        >
          <h2 className="font-semibold mb-1 text-sm">Hasil Ujian</h2>
          <p className="text-xs text-gray-600">
            Lihat nilai ujian yang sudah Anda kerjakan.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
