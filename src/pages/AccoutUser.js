import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountUser = () => {
  const [user, setUser] = useState(null); // Khai báo state user
  const [userForm, setUserForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        setUser(response.data);
        setUserForm({
          username: response.data.username || '',
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleGoBack = () => {
    navigate("/user");
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        ...user,
        username: userForm.username,
        fullName: userForm.fullName,
        email: userForm.email,
        phone: userForm.phone,
        address: userForm.address
      };
      
      const response = await axios.put(`http://localhost:8080/user/${userId}`, updatedUserData);
      setUser(response.data);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  return (
    <div className="profile-section">
        <div className="profile-section-header">
      <button className="back-button" onClick={handleGoBack}>←</button>
      <h2>Thông tin cá nhân</h2>
      </div>
      {!user ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="profile-container">
          {isEditing ? (
            <form className="profile-form" onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  value={userForm.username}
                  onChange={handleUserFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={userForm.fullName}
                  onChange={handleUserFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={userForm.phone}
                  onChange={handleUserFormChange}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={userForm.address}
                  onChange={handleUserFormChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit">Lưu thay đổi</button>
                <button type="button" onClick={() => setIsEditing(false)}>Hủy</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Tên đăng nhập:</strong> {user.username}</p>
              <p><strong>Họ tên:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số điện thoại:</strong> {user.phone || 'Chưa cập nhật'}</p>
              <p><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</p>
              <button className="edit-button" onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountUser;
