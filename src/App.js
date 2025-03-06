import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>Trang chủ</h2>} />
        <Route path="/login" element={<LoginPage />} />
        <Route  path="/register" element={<RegisterPage />} />
        <Route  path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;



