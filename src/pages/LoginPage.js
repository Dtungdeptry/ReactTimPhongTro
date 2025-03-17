import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // Import CSS

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("Dữ liệu phản hồi từ server:", data);

        if (response.ok) {
            // Kiểm tra token trước khi lưu
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("roleId", data.roleId);
                alert("Đăng nhập thành công!");

                // Điều hướng dựa trên roleId
                switch (parseInt(data.roleId)) {
                    case 1:
                        navigate("/admin");
                        break;
                    case 2:
                        navigate("/user");
                        break;
                    case 3:
                        navigate("/owner");
                        break;
                    default:
                        alert("Không xác định vai trò!");
                }
            } else {
                alert("Phản hồi không có token!");
            }
        } else {
            alert(data.message || "Sai tài khoản hoặc mật khẩu!");
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi hệ thống! Vui lòng thử lại.");
    }
};

  
  return (
    <div className="auth-container">
      <h2>Đăng Nhập</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Đăng Nhập</button>
      </form>
      <div className="auth-footer">
        <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
