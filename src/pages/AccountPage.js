import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

const AccountPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Lấy thông tin người dùng từ API khi trang được load
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`http://localhost:8080/owner/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    };

    fetchUserData();
  }, [userId]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userId");  // Xóa userId khi đăng xuất
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate("/owner");
  };

  // Hàm cập nhật thông tin người dùng
  const handleUpdate = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8080/owner/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Cập nhật thông tin thành công!");
    } else {
      alert("Lỗi cập nhật thông tin. Vui lòng thử lại!");
    }
  }

  return (
    <div className="auth-container">
      <div className="header-owner">
      <button className="back-button" onClick={handleGoBack}>
        ←
      </button>
      <h2>Tài Khoản</h2>
      </div>
      <form className="auth-form" onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={userData.fullName}
          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={userData.address}
          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
          required
        />
        <button type="submit">Cập nhật thông tin</button>
        <button type="button" onClick={handleLogout} style={{ backgroundColor: "red", marginTop: "10px" }}>
          Đăng xuất
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
