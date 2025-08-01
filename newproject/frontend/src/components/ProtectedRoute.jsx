import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mostra um loading enquanto o token é verificado no carregamento da página
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para o login, guardando a página que ele tentou acessar.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se a rota exige permissões específicas.
  // Esta verificação agora é mais robusta:
  // 1. Garante que o objeto `user` existe.
  // 2. Garante que a propriedade `user.role` existe.
  // 3. Garante que o `role` do usuário está na lista de permissões.
  if (allowedRoles && (!user || !user.role || !allowedRoles.includes(user.role))) {
    // Adiciona um log para facilitar a depuração no console do navegador.
    console.warn(`Acesso negado à rota ${location.pathname}. Papel do usuário:`, user?.role, 'Papéis permitidos:', allowedRoles);
    // Se não tiver permissão, redireciona para uma página de "Acesso Negado".
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;