// src/pages/student/StudentExamList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllExams } from "../../services/examService";

const StudentExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchExams = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getAllExams();
      setExams(data || []);
    } catch (err) {
      console.error("Error getAllExams:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Gagal mengambil daftar ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Daftar Ujian</h1>
      <p className="text-sm text-gray-600 mb-4">
        Ujian yang tersedia untuk Anda.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Memuat ujian...</div>
      ) : exams.length === 0 ? (
        <div className="text-sm text-gray-500">
          Belum ada ujian yang tersedia.
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="border rounded-lg p-3 bg-white shadow-sm flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-sm">{exam.title}</div>
                <div className="text-xs text-gray-600">
                  Mapel: {exam.subject} · Durasi: {exam.duration} menit
                </div>
              </div>
              <Link
                to={`/student/exams/${exam.id}`}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
              >
                Kerjakan
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExamList;
