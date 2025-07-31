import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css'; // Novo CSS para o dashboard

const Dashboard = () => {
  const { user } = useAuth();

  // Componente para o dashboard do Organizador
  const OrganizerDashboard = () => (
    <div className="dashboard-section">
      <h3>Painel do Organizador</h3>
      <p>Gerencie seus eventos, veja estatísticas e muito mais.</p>
      <div className="dashboard-actions">
        <Link to="/events/new" className="action-card">
          <h4>Criar Novo Evento</h4>
          <p>Comece a planejar seu próximo grande evento.</p>
        </Link>
        <Link to="/my-events" className="action-card">
          <h4>Meus Eventos</h4>
          <p>Veja e edite os eventos que você criou.</p>
        </Link>
        <Link to="/organizer/stats" className="action-card">
          <h4>Estatísticas</h4>
          <p>Analise o desempenho dos seus eventos.</p>
        </Link>
      </div>
    </div>
  );

  // Componente para o dashboard do Participante
  const ParticipantDashboard = () => (
    <div className="dashboard-section">
      <h3>Painel do Participante</h3>
      <p>Encontre eventos e gerencie suas inscrições.</p>
      <div className="dashboard-actions">
        <Link to="/events" className="action-card">
          <h4>Explorar Eventos</h4>
          <p>Descubra novos eventos para participar.</p>
        </Link>
        <Link to="/my-tickets" className="action-card">
          <h4>Minhas Inscrições</h4>
          <p>Veja os eventos para os quais você está inscrito.</p>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bem-vindo(a) de volta, {user?.name || 'Usuário'}!</h1>
        <p>Aqui está um resumo da sua atividade na plataforma.</p>
      </header>

      {/* Renderização condicional baseada no papel do usuário */}
      {user?.role === 'organizador' && <OrganizerDashboard />}
      {user?.role === 'participante' && <ParticipantDashboard />}
      {/* Admins podem ver o painel de organizador e, futuramente, um painel de admin */}
      {user?.role === 'admin' && <OrganizerDashboard />}
    </div>
  );
};

export default Dashboard;