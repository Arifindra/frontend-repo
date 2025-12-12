import React, { useState } from "react";
import AppShell from "../../components/AppShell";

export default function StudentBankSoal() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      id: 1,
      name: "Matematika",
      questions: [
        { q: "Hitung 15 + 8 =", a: "23" },
        { q: "Berapakah hasil 9 × 6 =", a: "54" },
        { q: "Akar dari 49 adalah =", a: "7" },
      ],
    },
    {
      id: 2,
      name: "Bahasa Indonesia",
      questions: [
        { q: "Sinonim dari kata 'cantik' adalah ...", a: "indah" },
        { q: "Antonim dari 'besar' adalah ...", a: "kecil" },
        { q: "Kata dasar dari 'berlari' adalah ...", a: "lari" },
      ],
    },
    {
      id: 3,
      name: "IPA",
      questions: [
        { q: "Zat yang dibutuhkan tumbuhan untuk fotosintesis adalah ...", a: "karbon dioksida" },
        { q: "Planet terbesar di tata surya adalah ...", a: "Jupiter" },
        { q: "Air berubah menjadi uap disebut ...", a: "penguapan" },
      ],
    },
  ];

  return (
    <AppShell role="Student">
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">📚 Bank Soal</h1>

        {!selectedSubject ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => setSelectedSubject(subj)}
                className="cursor-pointer border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-blue-600">{subj.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {subj.questions.length} soal latihan
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedSubject.name}</h2>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100"
              >
                ⬅ Kembali
              </button>
            </div>

            <ul className="space-y-3">
              {selectedSubject.questions.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-medium">
                    {index + 1}. {item.q}
                  </p>
                  <p className="text-green-700 mt-1">✅ Jawaban: {item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}
