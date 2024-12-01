import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    console.log("Şifre sıfırlama isteği başlatıldı:", { email });

    try {
      const response = await fetch('http://localhost:3000/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      console.log("API yanıtı alındı:", response); 

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData); 
        setError(errorData.message || 'Bir hata oluştu.');
      } else {
        const data = await response.json();
        console.log("Başarıyla şifre sıfırlama e-postası gönderildi:", data); 
        setMessage(data.message); 
      }
    } catch (err) {
      console.error('API Hatası:', err); 
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Şifremi Unuttum</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-posta Adresi:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ForgotPassword;
