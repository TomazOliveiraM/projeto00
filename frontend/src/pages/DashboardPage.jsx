import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from '../components/Dashboard/AdminDashboard.jsx';
import OrganizerDashboard from '../components/Dashboard/OrganizerDashboard.jsx';
import ParticipantDashboard from '../components/Dashboard/ParticipantDashboard.jsx';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const renderDashboardByRole = () => {
    // Enquanto o AuthContext está carregando, o usuário pode ser nulo.
    if (!user) {
      return <p>Carregando informações do usuário...</p>;
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'organizador':
        return <OrganizerDashboard />;
      case 'participante':
        return <ParticipantDashboard />;
      default:
        return <p>Seu papel de usuário ({user.role}) é desconhecido. Contate o suporte.</p>;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Bem-vindo, {user.name}!</p>}
      <button onClick={logout}>Sair</button>
      <hr />
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;
