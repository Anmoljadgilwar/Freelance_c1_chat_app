import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/UI/LanguageSwitcher";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Chat from "./components/Chat/Chat";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Loading from "./components/UI/Loading";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/chat"} replace />;
  }

  return children;
};

function App() {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <div>
                    <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
                      <LanguageSwitcher />
                    </div>
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
