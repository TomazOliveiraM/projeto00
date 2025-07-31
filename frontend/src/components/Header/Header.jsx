import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  // Usando o contexto de autenticação para exibir links dinamicamente
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">MeuEvento</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            {/* Correção: Aplicando a classe 'active' diretamente */}
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>
              Eventos
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/my-tickets" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Meus Ingressos
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Perfil
                </NavLink>
              </li>
              <li>
                <a onClick={logout} style={{ cursor: 'pointer' }}>Logout</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Registrar</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
