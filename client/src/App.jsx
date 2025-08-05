import "./App.scss";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";
import AddCredentials from "./components/pages/AddPassword";
import Passwords from "./components/pages/Passwords";
import Logs from "./components/pages/Logs";
import Users from "./components/pages/Users";
import AddUser from "./components/pages/AddUser";
import ManageUser from "./components/pages/ManageUser";
import Settings from "./components/pages/Settings";
import UpdateProfile from "./components/pages/UpdateProfile";
import ResetPassword from "./components/ResetPassword";

function App() {
  const storedUser = localStorage.getItem("user");
  const userFromStorage = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(userFromStorage);

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      const { email } = JSON.parse(stored);

      try {
        const res = await fetch(
          `https://enovation-vault-1.onrender.com/user/${email}`
        );
        const dbUser = await res.json();

        if (dbUser?.role) {
          localStorage.setItem("user", JSON.stringify(dbUser));
          setUser(dbUser);
        }
      } catch (err) {
        console.error("Error fetching user from DB:", err);
      }
    };

    fetchUserFromDB();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* The system paths Start */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credentials/"
          element={
            <ProtectedRoute>
              <Passwords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credentials/new"
          element={
            <ProtectedRoute>
              <AddCredentials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credentials/update"
          element={
            <ProtectedRoute>
              <AddCredentials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <Logs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/add"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/manage"
          element={
            <ProtectedRoute>
              <ManageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/update"
          element={
            <ProtectedRoute>
              <UpdateProfile user={userFromStorage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* The system paths End */}
      </Routes>
    </Router>
  );
}

export default App;
