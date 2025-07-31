import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      loginWithToken(token, JSON.parse(decodeURIComponent(user)));
      navigate('/dashboard');
    } else {
      // Lidar com erro, redirecionar para o login
      navigate('/login');
    }
  }, [location, navigate, loginWithToken]);

  return <div>Autenticando... Por favor, aguarde.</div>;
};

export default AuthCallbackPage;