import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import OwnerPage from "./pages/OwnerPage";
import AccountPage from "./pages/AccountPage";
import UserPage from "./pages/UserPage";
import AccountUser from "./pages/AccoutUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>Trang chủ</h2>} />
        <Route path="/login" element={<LoginPage />} />
        <Route  path="/register" element={<RegisterPage />} />
        <Route  path="/admin" element={<AdminPage />} />
        <Route  path="/owner" element={<OwnerPage />} />
        <Route path="/account-owner" element={<AccountPage />} />
        <Route path="/account-user" element={<AccountUser />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;



