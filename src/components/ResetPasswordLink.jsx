import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordLink = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      navigate(`/reset-password?token=${token}`);
    } else {

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
