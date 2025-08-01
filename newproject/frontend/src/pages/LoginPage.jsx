import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importando o CSS para estilização
// Supondo que você tenha um hook de autenticação
import { useAuth } from '../context/AuthContext'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const navigate = useNavigate();
  const { login } = useAuth(); // Usando o hook de autenticação real

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      // Chama a função de login do seu AuthContext
      await login(email, password);
      // Se o login for bem-sucedido, redirecione para o dashboard
      navigate('/dashboard'); 
    } catch (err) {
      // Trata erros de login (ex: credenciais inválidas)
      setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redireciona para a rota de autenticação do Google no backend
    // Ajuste a URL se o seu backend estiver em outra porta/endereço
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2>Login</h2>
        <p>Acesse sua conta para continuar.</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="divider"><span>OU</span></div>
        
        <button onClick={handleGoogleLogin} className="google-login-button" disabled={loading}>
          Entrar com Google
        </button>
        
        <div className="register-link">
          <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;