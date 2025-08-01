import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Novo arquivo de estilo
import { useAuth } from '../context/AuthContext'; // Supondo que você usará o contexto para registrar

const RegisterPage = () => {
  const { role } = useParams(); // Captura 'participante' ou 'organizador' da URL
  const navigate = useNavigate();
  const { register } = useAuth(); // Supondo uma função 'register' no seu AuthContext

  // Estado para os campos do formulário
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '', // Campo específico para organizador
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Se nenhum 'role' for definido na URL, mostra a tela de seleção.
  if (!role) {
    return (
      <div className="role-selection-container">
        <h2>Como você quer se cadastrar?</h2>
        <p>Escolha seu tipo de conta para começar a jornada.</p>
        <div className="role-options">
          <Link to="/register/participante" className="role-card">
            <h3>Participante</h3>
            <p>Quero encontrar e participar de eventos incríveis.</p>
          </Link>
          <Link to="/register/organizador" className="role-card">
            <h3>Organizador</h3>
            <p>Quero criar, gerenciar e divulgar meus próprios eventos.</p>
          </Link>
        </div>
      </div>
    );
  }

  // Redireciona se o 'role' for inválido
  if (role !== 'participante' && role !== 'organizador') {
    navigate('/register');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formState.password !== formState.confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        role: role,
        ...(role === 'organizador' && { organizationName: formState.organizationName }),
      };

      // A linha abaixo agora fará a chamada real para a API através do seu AuthContext
      await register(userData); 

      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha no registro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-form-wrapper">
        <h2>Criar Conta de <span className="role-highlight">{role === 'organizador' ? 'Organizador' : 'Participante'}</span></h2>
        <p>Preencha os dados abaixo para continuar.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} required disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} required disabled={loading} />
          </div>

          {role === 'organizador' && (
            <div className="form-group">
              <label htmlFor="organizationName">Nome da Organização (Opcional)</label>
              <input type="text" id="organizationName" name="organizationName" value={formState.organizationName} onChange={handleInputChange} disabled={loading} />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" value={formState.password} onChange={handleInputChange} required disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formState.confirmPassword} onChange={handleInputChange} required disabled={loading} />
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="extra-links">
          <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
          <p><Link to="/register">Voltar para a seleção de conta</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
