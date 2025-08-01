import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Eventify</Link>
      <ul className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink></li>
            {user?.role === 'admin' && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : ''}>Admin</NavLink></li>
            )}
            <li><span className={styles.userName}>Olá, {user.name}</span></li>
            <li><button onClick={logout} className={styles.logoutButton}>Sair</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ''}>Login</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => isActive ? styles.active : ''}>Registrar</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;