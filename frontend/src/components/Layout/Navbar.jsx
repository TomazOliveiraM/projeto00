import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Este log é crucial para depurar. Verifique o console do navegador
  // para ver o que está dentro do objeto 'user' quando um organizador faz login.
  console.log('Usuário no Navbar:', user);

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventPlatform
        </Link>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          
          {isAuthenticated ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>

              {/* LÓGICA PRINCIPAL: Mostra o link para criar evento */}
              {(user?.role === 'organizador' || user?.role === 'admin') && (
                <li>
                  <NavLink to="/events/new" className="navbar-cta">
                    Criar Evento
                  </NavLink>
                </li>
              )}

              {user?.role === 'admin' && (
                <li><NavLink to="/admin">Admin</NavLink></li>
              )}

              <li><button onClick={logout} className="logout-button">Sair</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register" className="navbar-cta">Cadastre-se</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;