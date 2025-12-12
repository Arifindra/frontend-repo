// src/pages/student/StudentExam.jsx
import { useEffect, useState } from "react";
import { getAllExams } from "../../services/examService";
import {
  startExamSession,
  submitExam,
} from "../../services/examSessionService";

const StudentExam = () => {
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentExam, setCurrentExam] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Ambil daftar ujian yg boleh diikuti siswa
  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      setErrorMsg("");
      const data = await getAllExams(); // GET /api/exams (backend sudah filter role siswa)
      setExams(data || []);
    } catch (err) {
      console.error("Error getAllExams:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil daftar ujian."
      );
    } finally {
      setLoadingExams(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Mulai ujian: panggil /exam-session/start
  const handleStartExam = async (exam) => {
    try {
      setErrorMsg("");
      setCurrentExam(null);
      setSessionId(null);
      setAnswers({});

      const data = await startExamSession(exam.id);
      // data = { sessionId, exam }
      setSessionId(data.sessionId);
      setCurrentExam(data.exam);
      setAnswers({});
    } catch (err) {
      console.error("Error startExamSession:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal memulai sesi ujian."
      );
    }
  };

  // Ubah jawaban
  const handleChangeAnswer = (questionId, payload) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        ...payload,
      },
    }));
  };

  // Submit ujian ke backend
  const handleSubmit = async (auto = false) => {
    try {
      if (!sessionId || !currentExam) {
        setErrorMsg("Sesi ujian tidak valid.");
        return;
      }

      setSubmitting(true);
      setErrorMsg("");

      const questions =
        currentExam.Questions || currentExam.questions || [];

      const ansArray = questions.map((q) => {
        const ans = answers[q.id] || {};
        const base = { questionId: q.id };

        if (q.type === "MULTIPLE_CHOICE") {
          base.chosenOption = ans.chosenOption || null;
        } else if (q.type === "ESSAY") {
          base.essayAnswer = ans.essayAnswer || "";
        }

        return base;
      });

      await submitExam({
        sessionId,
        answers: ansArray,
      });

      if (auto) {
        alert(
          "Waktu habis. Ujian otomatis dikumpulkan.\nNilai akan diumumkan setelah diperiksa guru."
        );
      } else {
        alert(
          "Ujian berhasil dikumpulkan.\nNilai akan diumumkan setelah diperiksa guru."
        );
      }

      // Reset state setelah submit
      setCurrentExam(null);
      setSessionId(null);
      setAnswers({});
    } catch (err) {
      console.error("Error submitExam:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengumpulkan ujian."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Daftar soal dari ujian yang sedang dikerjakan
  const questions =
    currentExam?.Questions || currentExam?.questions || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Ujian Online</h1>
      <p className="text-sm text-gray-600 mb-4">
        Pilih ujian yang tersedia dan kerjakan sesuai waktu yang
        ditentukan.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}

      {/* Jika belum mulai ujian, tampilkan daftar ujian */}
      {!currentExam && (
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-4">
          <h2 className="text-sm font-semibold mb-2">
            Daftar Ujian Tersedia
          </h2>
          {loadingExams ? (
            <p className="text-xs text-gray-500">Memuat daftar ujian...</p>
          ) : exams.length === 0 ? (
            <p className="text-xs text-gray-500">
              Belum ada ujian yang bisa diikuti saat ini.
            </p>
          ) : (
            <div className="space-y-2">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="border rounded px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm"
                >
                  <div>
                    <div className="font-semibold">{exam.title}</div>
                    <div className="text-xs text-gray-600">
                      Mapel: {exam.subject} · Durasi:{" "}
                      {exam.duration || 60} menit
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mulai Ujian
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jika sedang mengerjakan ujian, tampilkan soalnya */}
      {currentExam && (
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-semibold">
                {currentExam.title}
              </h2>
              <p className="text-xs text-gray-600">
                Mapel: {currentExam.subject} · Durasi:{" "}
                {currentExam.duration || 60} menit
              </p>
            </div>
            {/* di sini nanti bisa ditambah timer */}
          </div>

          {questions.length === 0 ? (
            <p className="text-xs text-gray-500">
              Belum ada soal untuk ujian ini.
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <div className="mb-2">
                    <span className="font-semibold mr-2">
                      {idx + 1}.
                    </span>
                    <span>{q.questionText}</span>
                    <span className="ml-2 text-[11px] text-gray-500">
                      ({q.type === "ESSAY"
                        ? "Essay"
                        : "Pilihan ganda"}
                      , bobot {q.score || 1})
                    </span>
                  </div>

                  {q.type === "MULTIPLE_CHOICE" && q.options && (
                    <div className="space-y-1">
                      {["A", "B", "C", "D", "E"].map((opt) => {
                        const text = q.options[opt];
                        if (!text) return null;
                        return (
                          <label
                            key={opt}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt}
                              checked={
                                answers[q.id]?.chosenOption === opt
                              }
                              onChange={() =>
                                handleChangeAnswer(q.id, {
                                  chosenOption: opt,
                                })
                              }
                            />
                            <span>
                              <span className="font-semibold">
                                {opt}.
                              </span>{" "}
                              {text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "ESSAY" && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded px-2 py-1 text-sm min-h-[80px]"
                        placeholder="Tuliskan jawaban Anda di sini..."
                        value={answers[q.id]?.essayAnswer || ""}
                        onChange={(e) =>
                          handleChangeAnswer(q.id, {
                            essayAnswer: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Yakin ingin keluar dari ujian? Jawaban yang belum disimpan akan hilang."
                  )
                ) {
                  setCurrentExam(null);
                  setSessionId(null);
                  setAnswers({});
                }
              }}
              className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kumpulkan Ujian"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExam;
