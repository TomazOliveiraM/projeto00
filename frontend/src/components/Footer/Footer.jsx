import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} MeuEvento. Todos os direitos reservados.</p>
      <p>Desenvolvido com ❤️ por <a href="https://github.com" target="_blank" rel="noopener noreferrer">Você</a></p>
    </footer>
  );
};

export default Footer;