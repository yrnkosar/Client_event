import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Şifre başarıyla sıfırlandı!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Şifre sıfırlama başarısız');
      }
    } catch (error) {
      setMessage('Bir hata oluştu');
    }
  };

  return (
    <div>
      <h1>Şifreyi Sıfırla</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword">Yeni Şifre:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Şifreyi Sıfırla</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
