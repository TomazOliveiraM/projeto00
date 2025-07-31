import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
};

export default UnauthorizedPage;