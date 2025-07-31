import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa o hook de autenticação
import api from '../services/api'; // Supondo que você tenha um cliente de API configurado

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth(); // Utiliza o hook para obter a função
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    const finalizeLogin = async (authToken) => {
      try {
        // O backend já validou o usuário do Google e nos deu nosso próprio token JWT.
        // Agora, usamos esse token para "logar" no frontend.
        await loginWithToken(authToken);
        navigate('/dashboard'); // Redireciona para o dashboard após o sucesso
      } catch (e) {
        console.error("Erro ao finalizar o login no frontend:", e);
        navigate('/login?error=auth_failed');
      }
    };

    if (error) {
      console.error("Erro retornado pelo callback do Google:", error);
      // Redireciona para a página de login com uma mensagem de erro
      navigate(`/login?error=${encodeURIComponent(error)}`);
    } else if (token) {
      // O backend redirecionou com o token JWT na URL
      finalizeLogin(token);
    } else {
      // Caso inesperado
      console.error("Nenhum token ou erro encontrado no callback.");
      navigate('/login?error=unexpected_error');
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Autenticando, por favor aguarde...</h2>
      {/* Você pode adicionar um spinner de carregamento aqui */}
    </div>
  );
};

export default AuthCallback;
