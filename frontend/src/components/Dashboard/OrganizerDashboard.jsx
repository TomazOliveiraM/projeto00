import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const ParticipantDashboard = () => {
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/users/me/subscriptions');
        setSubscribedEvents(response.data);
      } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  if (loading) return <p>Carregando seus eventos...</p>;

  return (
    <div>
      <h2>Minhas Inscrições</h2>
      {subscribedEvents.length > 0 ? (
        <div className="dashboard-list">
          {subscribedEvents.map(event => (
            <div key={event._id} className="dashboard-item">
              <h3>{event.title}</h3>
              <p>Data: {new Date(event.date).toLocaleDateString()}</p>
              <Link to={`/events/${event._id}`}>Ver Detalhes</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não se inscreveu em nenhum evento. <Link to="/">Explore eventos</Link> para começar!</p>
      )}
    </div>
  );
};

export default ParticipantDashboard;

