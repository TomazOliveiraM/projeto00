import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'; // Importa o novo estilo visual

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import EventFormPage from './pages/EventFormPage';
import AdminPage from './pages/AdminPage';
import EventsListPage from './pages/EventsListPage'; // Nova página
import EventDetailsPage from './pages/EventDetailsPage'; // Página de detalhes que criamos
import MyEventsPage from './pages/MyEventsPage'; // Nova página
import MyTicketsPage from './pages/MyTicketsPage'; // Nova página
import OrganizerStatsPage from './pages/OrganizerStatsPage'; // Nova página

function App() {
  return (
    // O AuthProvider já está no main.jsx, então foi removido daqui para evitar duplicação.
    <Routes>
      {/* Rotas que usam o Layout (com Navbar e Footer) */}
      <Route element={<Layout />}>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:role?" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events" element={<EventsListPage />} />

        {/* Rotas Protegidas */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/events/new"
          element={<ProtectedRoute allowedRoles={['admin', 'organizador']}><EventFormPage /></ProtectedRoute>}
        />
        <Route
          path="/events/edit/:id"
          element={<ProtectedRoute allowedRoles={['admin', 'organizador']}><EventFormPage /></ProtectedRoute>}
        />
        <Route
          path="/my-events"
          element={<ProtectedRoute allowedRoles={['admin', 'organizador']}><MyEventsPage /></ProtectedRoute>}
        />
        <Route
          path="/organizer/stats"
          element={<ProtectedRoute allowedRoles={['admin', 'organizador']}><OrganizerStatsPage /></ProtectedRoute>}
        />
        <Route
          path="/my-tickets"
          element={<ProtectedRoute allowedRoles={['participante', 'admin']}><MyTicketsPage /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  );
}

export default App;
