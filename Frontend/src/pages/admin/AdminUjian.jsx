import React, { useState } from "react";

export default function AdminUjian() {
  const [exams, setExams] = useState([
    { id: 1, nama: "Ujian Akhir Semester", mapel: "Matematika", status: "Aktif" },
    { id: 2, nama: "Try Out Nasional", mapel: "Bahasa Inggris", status: "Selesai" },
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manajemen Ujian</h2>
      <table className="w-full border bg-white text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border px-3 py-2 text-left">Nama Ujian</th>
            <th className="border px-3 py-2 text-left">Mapel</th>
            <th className="border px-3 py-2 text-center">Status</th>
            <th className="border px-3 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((ex) => (
            <tr key={ex.id}>
              <td className="border px-3 py-2">{ex.nama}</td>
              <td className="border px-3 py-2">{ex.mapel}</td>
              <td className="border px-3 py-2 text-center">{ex.status}</td>
              <td className="border px-3 py-2 text-center">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 ml-3 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
