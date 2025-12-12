// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

// 🔹 Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBankSoal from "./pages/admin/AdminBankSoal";
import AdminUjian from "./pages/admin/AdminUjian";
import AdminHasil from "./pages/admin/AdminHasil";

// 🔹 Teacher Pages
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherBankSoal from "./pages/teacher/TeacherBankSoal";
import TeacherUjian from "./pages/teacher/TeacherUjian";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherExamDetail from "./pages/teacher/TeacherExamDetail";


// 🔹 Student Pages
import StudentHome from "./pages/student/StudentHome";
import StudentExam from "./pages/student/StudentExam";
import StudentBankSoal from "./pages/student/StudentBankSoal";
import StudentProfile from "./pages/student/StudentProfile";

// 🔹 Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// ==============================
// Helper: baca user dari localStorage
// ==============================
const getCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    if (parsed?.role) {
      parsed.role = parsed.role.toUpperCase();
    }
    return parsed;
  } catch (error) {
    console.error("Gagal parse user dari localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

// ==============================
// Helper: path home berdasarkan role
// ==============================
const getHomePathByRole = (role) => {
  if (!role) return "/login";
  const upper = String(role).toUpperCase();

  switch (upper) {
    case "ADMIN":
      return "/admin/home";
    case "GURU":
    case "TEACHER":
      return "/teacher/home";
    case "SISWA":
    case "STUDENT":
      return "/student/home";
    default:
      return "/login";
  }
};

export default function App() {
  const user = getCurrentUser();

  return (
    <Router>
      <Routes>
        {/* ======= AUTH ======= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ======= DEFAULT ROOT ======= */}
        <Route
          path="/"
          element={<Navigate to={getHomePathByRole(user?.role)} replace />}
        />

        {/* ======= ADMIN ROUTES ======= */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppShell role="ADMIN">
                <Routes>
                  <Route path="home" element={<AdminHome />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="bank-soal" element={<AdminBankSoal />} />
                  <Route path="ujian" element={<AdminUjian />} />
                  <Route path="hasil" element={<AdminHasil />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ======= TEACHER ROUTES ======= */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={["GURU", "TEACHER"]}>
              <AppShell role="GURU">
                <Routes>
                  <Route path="home" element={<TeacherHome />} />
                  <Route path="bank-soal" element={<TeacherBankSoal />} />
                  <Route path="ujian" element={<TeacherUjian />} />
                  <Route path="ujian/:id" element={<TeacherExamDetail />} />
                  <Route path="hasil" element={<TeacherResults />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ======= STUDENT ROUTES ======= */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={["SISWA", "STUDENT"]}>
              <AppShell role="SISWA">
                <Routes>
                  <Route path="home" element={<StudentHome />} />
                  <Route path="ujian" element={<StudentExam />} />
                  <Route path="bank-soal" element={<StudentBankSoal />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ======= CATCH ALL ======= */}
        <Route
          path="*"
          element={<Navigate to={getHomePathByRole(user?.role)} replace />}
        />
      </Routes>
    </Router>
  );
}
