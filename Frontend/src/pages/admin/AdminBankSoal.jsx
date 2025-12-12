import React, { useState } from "react";

export default function AdminBankSoal() {
  const [questions, setQuestions] = useState([
    { id: 1, mapel: "Matematika", jumlah: 40 },
    { id: 2, mapel: "Bahasa Inggris", jumlah: 50 },
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bank Soal</h2>
      <table className="w-full border bg-white text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border px-3 py-2 text-left">Mata Pelajaran</th>
            <th className="border px-3 py-2 text-center">Jumlah Soal</th>
            <th className="border px-3 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td className="border px-3 py-2">{q.mapel}</td>
              <td className="border px-3 py-2 text-center">{q.jumlah}</td>
              <td className="border px-3 py-2 text-center">
                <button className="text-blue-600 hover:underline">Lihat</button>
                <button className="text-red-600 ml-3 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
