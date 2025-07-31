import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard/EventCard'; // Componente novo
import './HomePage.css'; // CSS novo

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // TODO: Substitua pela sua chamada de API real
        // const response = await api.get('/api/events?limit=6');
        // setEvents(response.data);

        // Dados mocados para demonstração
        const mockEvents = [
          {
            id: 'evt1',
            title: 'Conferência de Tecnologia 2025',
            date: '2025-10-26T19:00:00Z',
            location: 'Centro de Convenções, São Paulo',
            description: 'A maior conferência de tecnologia da América Latina, com palestras, workshops e networking.',
            imageUrl: 'https://i0.wp.com/blog.portaleducacao.com.br/wp-content/uploads/2022/02/365-O-que-e%CC%81-tecnologia_.jpg?fit=740%2C416&ssl=1',
            isSubscribed: false, // Adicionado para simular status de inscrição
          },
          {
            id: 'evt2',
            title: 'Workshop de Design UX/UI',
            date: '2025-11-12T14:00:00Z',
            location: 'Online',
            description: 'Aprenda na prática os fundamentos de UX/UI com designers renomados do mercado.',
            imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
            isSubscribed: true, // Exemplo de um evento já inscrito
          },
          {
            id: 'evt3',
            title: 'Festival de Música Indie',
            date: '2025-12-05T18:00:00Z',
            location: 'Parque Ibirapuera, Pernambuco',
            description: 'Um dia inteiro de música com as melhores bandas da cena indie nacional e internacional.',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
            isSubscribed: false,
          },
        ];
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);

      } catch (err) {
        setError('Não foi possível carregar os eventos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="homepage-container">
      <section className="hero-section">
        <h1>Encontre os Melhores Eventos</h1>
        <p>Sua plataforma completa para descobrir, participar e organizar eventos inesquecíveis.</p>
      </section>

      <section className="events-section">
        <h2>Próximos Eventos</h2>
        {loading && <p>Carregando eventos...</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="events-grid">
          {!loading && events.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card-link">
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;