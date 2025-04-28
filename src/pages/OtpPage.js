import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Auth.css";

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
      if (!otp) {
        alert('Vui lòng nhập mã OTP!');
        return;
      }
  
      const username = localStorage.getItem('username');
      if (!username) {
        alert('Không tìm thấy tên người dùng!');
        return;
      }
  
      const response = await fetch(`http://localhost:8080/auth/verify?username=${username}&otp=${otp}`, {
        method: 'POST',
      });
      const result = await response.text();
  
      if (response.ok) {
        setMessage('Xác thực thành công!');
        alert('Xác thực thành công!');
        navigate('/login');
      } else {
        setMessage(result);
        alert('OTP không chính xác hoặc đã hết hạn!');
      }
  };
  

  const handleResendOtp = async () => {
      const response = await fetch(`http://localhost:8080/auth/resend-otp?username=${localStorage.getItem('username')}`, {
        method: 'POST',
      });
      const result = await response.text();
      setMessage(result);
      alert('Mã OTP mới đã được gửi!');
  };

  return (
    <div className="auth-container">
      <h2>Xác Thực OTP</h2>
      <input
        type="text"
        placeholder="Nhập mã OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleResendOtp}>Gửi Lại OTP</button>
      <button onClick={handleVerify}>Xác Thực</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OtpPage;
