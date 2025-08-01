import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// import Footer from './Footer'; // Se você tiver um rodapé

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

