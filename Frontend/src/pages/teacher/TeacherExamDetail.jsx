// src/pages/teacher/TeacherExamDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExamById } from "../../services/examService";
import { getExamSessionsByExam } from "../../services/examSessionService";

const TeacherExamDetail = () => {
  const { id } = useParams(); // examId dari URL
  const examId = Number(id);

  const [exam, setExam] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const [examData, sessionData] = await Promise.all([
        getExamById(examId),
        getExamSessionsByExam(examId),
      ]);

      setExam(examData);
      setSessions(sessionData || []);
    } catch (err) {
      console.error("Error TeacherExamDetail:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Gagal mengambil data detail ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isNaN(examId)) {
      setErrorMsg("ID ujian tidak valid.");
      setLoading(false);
      return;
    }
    fetchData();
  }, [examId]);

  // Map soal essay: questionId -> question
  const essayQuestions = useMemo(() => {
    const list = exam?.Questions || exam?.questions || [];
    return list.filter((q) => q.type === "ESSAY");
  }, [exam]);

  // Helper: cari jawaban essay untuk 1 sesi + 1 soal
  const findEssayAnswer = (session, questionId) => {
    const arr = session.answers || [];
    const found = arr.find((a) => a.questionId === questionId);
    return found?.essayAnswer || "";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div>
          <h1 className="text-lg md:text-xl font-bold">
            Detail Ujian
          </h1>
          <p className="text-xs text-gray-600">
            Lihat daftar peserta dan jawaban essay.
          </p>
        </div>
        <Link
          to="/teacher/ujian"
          className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          ← Kembali ke daftar ujian
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : !exam ? (
        <p className="text-sm text-gray-500">
          Ujian tidak ditemukan atau tidak bisa diakses.
        </p>
      ) : (
        <>
          {/* Info ujian */}
          <div className="border rounded-lg bg-white shadow-sm p-3 mb-4 text-sm">
            <div className="font-semibold mb-1">{exam.title}</div>
            <div className="text-xs text-gray-600 mb-1">
              Mapel: {exam.subject} · Durasi: {exam.duration || 60}{" "}
              menit
            </div>
            {exam.targetClass && (
              <div className="text-xs text-gray-600 mb-1">
                Kelas: {exam.targetClass}
              </div>
            )}
            {exam.description && (
              <p className="text-xs text-gray-700">
                {exam.description}
              </p>
            )}
          </div>

          {/* Daftar peserta */}
          <div className="border rounded-lg bg-white shadow-sm p-3 mb-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">
                Peserta Ujian ({sessions.length})
              </h2>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-gray-500">
                Belum ada siswa yang mengikuti ujian ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">
                        #
                      </th>
                      <th className="border px-2 py-1 text-left">
                        Nama
                      </th>
                      <th className="border px-2 py-1 text-left">
                        Kelas
                      </th>
                      <th className="border px-2 py-1 text-left">
                        Mulai
                      </th>
                      <th className="border px-2 py-1 text-left">
                        Selesai
                      </th>
                      <th className="border px-2 py-1 text-right">
                        Nilai (auto)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">
                          {idx + 1}
                        </td>
                        <td className="border px-2 py-1">
                          {s.User?.name || "-"}
                          <div className="text-[10px] text-gray-500">
                            {s.User?.email}
                          </div>
                        </td>
                        <td className="border px-2 py-1">
                          {s.User?.className || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {s.startedAt
                            ? new Date(s.startedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {s.endedAt
                            ? new Date(s.endedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {typeof s.finalScore === "number"
                            ? s.finalScore.toFixed(2)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Jawaban essay */}
          <div className="border rounded-lg bg-white shadow-sm p-3 text-sm">
            <h2 className="text-sm font-semibold mb-2">
              Jawaban Essay
            </h2>

            {essayQuestions.length === 0 ? (
              <p className="text-xs text-gray-500">
                Tidak ada soal essay pada ujian ini.
              </p>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-gray-500">
                Belum ada jawaban essay karena belum ada peserta.
              </p>
            ) : (
              <div className="space-y-3">
                {essayQuestions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="border rounded px-3 py-2 bg-gray-50"
                  >
                    <div className="mb-2">
                      <div className="text-xs font-semibold">
                        Soal Essay {qIdx + 1}
                      </div>
                      <div className="text-xs">
                        {q.questionText}
                      </div>
                    </div>
                    <div className="border rounded bg-white max-h-64 overflow-y-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1 text-left">
                              Siswa
                            </th>
                            <th className="border px-2 py-1 text-left">
                              Jawaban
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s) => {
                            const ans = findEssayAnswer(s, q.id);
                            return (
                              <tr
                                key={`${s.id}-${q.id}`}
                                className="align-top"
                              >
                                <td className="border px-2 py-1 w-40">
                                  <div className="font-semibold">
                                    {s.User?.name || "-"}
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    {s.User?.className || ""}
                                  </div>
                                </td>
                                <td className="border px-2 py-1">
                                  {ans ? (
                                    <pre className="whitespace-pre-wrap text-[11px]">
                                      {ans}
                                    </pre>
                                  ) : (
                                    <span className="text-[11px] text-gray-400">
                                      (belum ada jawaban)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherExamDetail;
