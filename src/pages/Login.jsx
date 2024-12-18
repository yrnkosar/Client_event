import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import jwtDecode from 'jwt-decode';

const Login = () => {
  const { setAuthToken } = useAuth(); 
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json(); 
  
      console.log('Parsed response data:', data); 
  
      if (!response.ok) {
        console.error('Login error:', data.message);
        setError(data.message || 'Login failed');
        return;
      }
  
      setAuthToken(data.token);  
      localStorage.setItem('authToken', data.token); 
  
    const decodedToken = jwtDecode(data.token);
    console.log('Decoded Token:', decodedToken);

    if (decodedToken.role === 'admin') {
      navigate('/admin');
    } else if (decodedToken.role === 'kullanıcı') {
      navigate('/home');
    } else {
      setError('Role not recognized.');
    }


  
    } catch (error) {
      console.error('Request failed:', error);
      setError('Login failed. Please try again.'); 
    }
  };
  return (
    <div>
      <h1>Giriş Yap</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Kullanıcı Adı:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Şifre:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Şifrenizi mi unuttunuz? <Link to="/forgot-password">Buraya tıklayın</Link>
      </p>
      <p>
        Henüz hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </div>
  );
};

export default Login;
