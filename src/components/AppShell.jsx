import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppShell({ children, role }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Daftar menu berdasarkan role
  const menuByRole = {
    ADMIN: [
      { name: "Dashboard", path: "/admin/home" },
      { name: "Users", path: "/admin/users" },
      { name: "Bank Soal", path: "/admin/bank-soal" },
      { name: "Ujian", path: "/admin/ujian" },
      { name: "Hasil", path: "/admin/hasil" },
    ],
    GURU: [
      { name: "Dashboard", path: "/teacher/home" },
      { name: "Bank Soal", path: "/teacher/bank-soal" },
      { name: "Ujian", path: "/teacher/ujian" },
      { name: "Hasil", path: "/teacher/hasil" },
    ],
    SISWA: [
      { name: "Dashboard", path: "/student/home" },
      { name: "Ujian", path: "/student/ujian" },
      { name: "Bank Soal", path: "/student/bank-soal" },
      { name: "Profil", path: "/student/profile" },
    ],
  };

  const menus = menuByRole[role.toUpperCase()] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md w-64 p-4 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <div className="text-xl font-bold mb-6 text-center border-b pb-3">
          Smart E-Ujian
        </div>

        <nav className="flex-1 space-y-2">
          {menus.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-auto bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </aside>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-gray-200 px-2 py-1 rounded"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">
            {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} Dashboard
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.name || "Pengguna"}
          </span>
        </header>

        {/* Isi Halaman */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
