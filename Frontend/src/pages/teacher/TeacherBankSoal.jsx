// src/pages/teacher/TeacherBankSoal.jsx
import { useEffect, useState } from "react";
import {
  getAllQuestions,
  getQuestionsByExam,
  createQuestion,
  deleteQuestion,
  uploadQuestionsExcel,
} from "../../services/questionService";
import { getAllExams } from "../../services/examService";

const TeacherBankSoal = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    type: "MULTIPLE_CHOICE",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    correctAnswer: "A",
    score: 1,
  });

  const [excelFile, setExcelFile] = useState(null);

  // =========================
  // Fetch ujian + soal
  // =========================
  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getAllExams();
      setExams(data || []);

      // kalau belum ada selectedExamId, pilih yang pertama
      if (!selectedExamId && data && data.length > 0) {
        setSelectedExamId(String(data[0].id));
      }
    } catch (err) {
      console.error("Error getAllExams:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal mengambil daftar ujian."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId) => {
    if (!examId) {
      setQuestions([]);
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      // kalau backend belum support examId di query, ganti ke getAllQuestions()
      const data = await getQuestionsByExam(examId);
      setQuestions(data || []);
    } catch (err) {
      console.error("Error getQuestions:", err);
      // fallback: ambil semua soal
      try {
        const all = await getAllQuestions();
        setQuestions(all || []);
      } catch (e2) {
        console.error("Error getAllQuestions:", e2);
        setErrorMsg(
          err.response?.data?.message || "Gagal mengambil bank soal."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchQuestions(selectedExamId);
    }
  }, [selectedExamId]);

  // =========================
  // Handler form soal
  // =========================
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedExamId) {
      setErrorMsg("Pilih ujian terlebih dahulu.");
      return;
    }

    if (!form.questionText.trim()) {
      setErrorMsg("Teks soal tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);

      let payload = {
        examId: parseInt(selectedExamId, 10),
        questionText: form.questionText,
        type: form.type,
        score: Number(form.score) || 1,
        isActive: true,
      };

      if (form.type === "MULTIPLE_CHOICE") {
        const options = {
          A: form.optionA,
          B: form.optionB,
          C: form.optionC,
          D: form.optionD,
          E: form.optionE,
        };

        if (!options.A || !options.B) {
          setErrorMsg("Minimal opsi A dan B harus diisi untuk pilihan ganda.");
          setSaving(false);
          return;
        }

        payload.options = options;
        payload.correctAnswer = form.correctAnswer || "A";
      }

      const res = await createQuestion(payload);

      setSuccessMsg(res.message || "Soal berhasil ditambahkan.");
      // reset form
      setForm({
        type: form.type,
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        correctAnswer: "A",
        score: 1,
      });

      // refresh list soal
      fetchQuestions(selectedExamId);
    } catch (err) {
      console.error("Error createQuestion:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menambah soal."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus soal ini?");
    if (!yakin) return;

    try {
      await deleteQuestion(id);
      setSuccessMsg("Soal berhasil dihapus.");
      fetchQuestions(selectedExamId);
    } catch (err) {
      console.error("Error deleteQuestion:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal menghapus soal."
      );
    }
  };

  // =========================
  // Upload Excel
  // =========================
  const handleUploadExcel = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!excelFile) {
      setErrorMsg("Pilih file Excel terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);
      const res = await uploadQuestionsExcel(excelFile);
      setSuccessMsg(res.message || "Upload soal berhasil.");
      setExcelFile(null);
      // refresh list soal
      fetchQuestions(selectedExamId);
    } catch (err) {
      console.error("Error uploadQuestionsExcel:", err);
      setErrorMsg(
        err.response?.data?.message || "Gagal upload file soal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-xl font-bold mb-2">Bank Soal Guru</h1>
      <p className="text-sm text-gray-600 mb-4">
        Kelola soal ujian per mata pelajaran / ujian.
      </p>

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-3 text-sm text-green-700 border border-green-300 bg-green-50 rounded px-3 py-2">
          {successMsg}
        </div>
      )}

      {/* Pilih Ujian */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-xs mb-1 font-semibold">
            Pilih Ujian
          </label>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {exams.length === 0 && (
              <option value="">Belum ada ujian</option>
            )}
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} ({exam.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form tambah soal */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-4 mb-6">
        <form
          onSubmit={handleCreateQuestion}
          className="border rounded-lg p-3 bg-white shadow-sm space-y-3"
        >
          <div>
            <label className="block text-xs mb-1 font-semibold">
              Jenis Soal
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChangeForm}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
              <option value="ESSAY">Essay</option>
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Teks Soal
            </label>
            <textarea
              name="questionText"
              value={form.questionText}
              onChange={handleChangeForm}
              rows={4}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Tulis pertanyaan di sini..."
            />
          </div>

          {form.type === "MULTIPLE_CHOICE" && (
            <div className="space-y-2">
              {["A", "B", "C", "D","E"].map((opt) => (
                <div key={opt}>
                  <label className="block text-xs mb-1 font-semibold">
                    Opsi {opt}
                  </label>
                  <input
                    type="text"
                    name={`option${opt}`}
                    value={form[`option${opt}`]}
                    onChange={handleChangeForm}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs mb-1 font-semibold">
                  Jawaban Benar
                </label>
                <select
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={handleChangeForm}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs mb-1 font-semibold">
              Bobot Nilai
            </label>
            <input
              type="number"
              name="score"
              value={form.score}
              onChange={handleChangeForm}
              className="w-full border rounded px-2 py-1 text-sm"
              min={1}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white rounded py-2 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Tambah Soal"}
          </button>
        </form>

        {/* Upload Excel + List Soal */}
        <div className="space-y-4">
          <form
            onSubmit={handleUploadExcel}
            className="border rounded-lg p-3 bg-white shadow-sm"
          >
            <p className="text-xs font-semibold mb-2">
              Upload Soal dari Excel
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files[0] || null)}
              className="text-xs mb-2"
            />
            <button
              type="submit"
              disabled={saving || !excelFile}
              className="bg-gray-800 text-white text-xs px-3 py-1 rounded disabled:opacity-60"
            >
              {saving ? "Mengupload..." : "Upload"}
            </button>
          </form>

          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs font-semibold mb-2">
              Daftar Soal ({questions.length})
            </p>

            {loading ? (
              <p className="text-xs text-gray-500">Memuat soal...</p>
            ) : questions.length === 0 ? (
              <p className="text-xs text-gray-500">
                Belum ada soal untuk ujian ini.
              </p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="border rounded p-2 text-xs flex justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold mb-1">
                        {idx + 1}. {q.questionText}
                      </div>
                      {q.type === "MULTIPLE_CHOICE" && q.options && (
                        <ul className="list-disc list-inside text-[11px] text-gray-700">
                          {["A", "B", "C", "D"].map((opt) =>
                            q.options[opt] ? (
                              <li key={opt}>
                                <strong>{opt}.</strong> {q.options[opt]}{" "}
                                {q.correctAnswer === opt && (
                                  <span className="text-green-600">
                                    (benar)
                                  </span>
                                )}
                              </li>
                            ) : null
                          )}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-[11px] text-gray-500">
                        Nilai: {q.score}
                      </span>
                      <button
                        className="text-[11px] text-red-600"
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherBankSoal;
