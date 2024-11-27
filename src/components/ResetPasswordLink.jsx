import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordLink = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL parametrelerinden token'ı al
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      // Eğer token varsa, ResetPassword sayfasına yönlendir
      navigate(`/reset-password?token=${token}`);
    } else {
      // Token yoksa hata mesajı veya farklı bir yönlendirme yapılabilir
      console.log('Geçersiz link');
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Yönlendiriliyorsunuz...</h2>
    </div>
  );
};

export default ResetPasswordLink;
