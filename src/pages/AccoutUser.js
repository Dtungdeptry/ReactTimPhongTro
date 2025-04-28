import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountUser = () => {
  const [user, setUser] = useState(null);
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
      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(response.data);
      setUserForm({
        username: response.data.username || '',
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
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
    const updatedUserData = {
      ...user,
      username: userForm.username,
      fullName: userForm.fullName,
      email: userForm.email,
      phone: userForm.phone,
      address: userForm.address
    };
    
    await axios.put(`http://localhost:8080/user/${userId}`, updatedUserData);
    setUser(updatedUserData);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-section">
        <div className="profile-section-header">
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
