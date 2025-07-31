import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Supondo que você tenha um cliente de API
import './MyTicketsPage.css'; // Novo CSS

// Componente para exibir um único ticket
const TicketCard = ({ ticket }) => (
  <div className="ticket-card">
    <div className="ticket-event-info">
      <h3>{ticket.event.title}</h3>
      <p>{new Date(ticket.event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      <p>{ticket.event.location}</p>
    </div>
    <div className="ticket-details">
      <p><strong>Status:</strong> <span className={`status-${ticket.status.toLowerCase()}`}>{ticket.status}</span></p>
      <p><strong>Inscrição em:</strong> {new Date(ticket.purchasedAt).toLocaleDateString('pt-BR')}</p>
      <Link to={`/events/${ticket.event.id}`} className="ticket-view-event">
        Ver Evento
      </Link>
    </div>
  </div>
);

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        // A chamada de API real é feita aqui.
        // O endpoint '/my-tickets' deve ser implementado no seu backend.
        const response = await api.get('/my-tickets');
        setTickets(response.data);

      } catch (err) {
        setError('Não foi possível carregar suas inscrições. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return <div className="page-container"><p>Carregando suas inscrições...</p></div>;
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }

  return (
    <div className="page-container my-tickets-page">
      <header className="page-header">
        <h1>Minhas Inscrições</h1>
        <p>Aqui estão todos os eventos para os quais você se inscreveu.</p>
      </header>
      
      {tickets.length > 0 ? (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="no-tickets-message">
          <h3>Você ainda não se inscreveu em nenhum evento.</h3>
          <p>Que tal encontrar um agora?</p>
          <Link to="/events" className="explore-button">Explorar Eventos</Link>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;