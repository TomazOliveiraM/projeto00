import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './EventCard.css';

const EventCard = ({ event }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // O estado inicial agora reflete se o usuário já está inscrito no evento.
  const [isSubscribed, setIsSubscribed] = useState(event.isSubscribed || false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState('');

  const handleSubscription = async (e) => {
    e.preventDefault(); // Impede a navegação ao clicar no botão dentro do Link
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${event.id}` } });
      return;
    }

    setIsSubscribing(true);
    setError('');

    try {
      // A chamada para a API de inscrição
      await api.post(`/events/${event.id}/subscribe`); // Garanta que o caminho da API está correto
      setIsSubscribed(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao se inscrever.');
      // Esconde o erro depois de alguns segundos
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubscribing(false);
    }
  };

  const canSubscribe = isAuthenticated && user?.role === 'participante';

  return (
    <Link to={`/events/${event.id}`} className="event-card-link">
      <div className="event-card">
        <img src={event.imageUrl} alt={event.title} className="event-card-image" />
        <div className="event-card-content">
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-date">
            📅 {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <p className="event-card-location">📍 {event.location}</p>
          <p className="event-card-description">{event.description.substring(0, 100)}...</p>
          
          <div className="event-card-footer">
            {canSubscribe && (
              isSubscribed ? (
                <button className="event-card-button subscribed" disabled>Inscrito</button>
              ) : (
                <button onClick={handleSubscription} disabled={isSubscribing} className="event-card-button subscribe">
                  {isSubscribing ? 'Inscrevendo...' : 'Inscrever-se'}
                </button>
              )
            )}
            {!isAuthenticated && (
              <button onClick={handleSubscription} className="event-card-button subscribe">
                Inscrever-se
              </button>
            )}
            {error && <small className="subscription-error">{error}</small>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
