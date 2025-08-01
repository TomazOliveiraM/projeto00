import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { eventId } = useParams(); // Obtém o eventId da URL

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Em um app real, você faria a busca pelo ID:
        // const response = await api.get(`/api/events/${eventId}`);
        // setEvent(response.data);

        // Dados mocados com base no ID para demonstração
        const mockEvents = [
          {
            id: 'evt1',
            title: 'Conferência de Tecnologia 2025',
            date: '2025-10-26T19:00:00Z',
            location: 'Centro de Convenções, São Paulo',
            description: 'A maior conferência de tecnologia da América Latina, com palestras, workshops e networking. Junte-se a nós para explorar as últimas tendências em IA, desenvolvimento de software, cibersegurança e muito mais. Uma oportunidade única para aprender com os melhores e expandir sua rede de contatos.',
            imageUrl: 'https://i0.wp.com/blog.portaleducacao.com.br/wp-content/uploads/2022/02/365-O-que-e%CC%81-tecnologia_.jpg?fit=740%2C416&ssl=1',
            isSubscribed: false,
          },
          {
            id: 'evt2',
            title: 'Workshop de Design UX/UI',
            date: '2025-11-12T14:00:00Z',
            location: 'Online',
            description: 'Aprenda na prática os fundamentos de UX/UI com designers renomados do mercado. Este workshop intensivo cobrirá desde a pesquisa de usuário até a prototipação e testes de usabilidade. Ideal para iniciantes e profissionais que desejam aprimorar suas habilidades.',
            imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
            isSubscribed: true,
          },
          {
            id: 'evt3',
            title: 'Festival de Música Indie',
            date: '2025-12-05T18:00:00Z',
            location: 'Parque Ibirapuera, Pernambuco',
            description: 'Um dia inteiro de música com as melhores bandas da cena indie nacional e internacional. Além dos shows, o festival contará com food trucks, feira de vinil e atividades culturais. Traga seus amigos e venha curtir!',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
            isSubscribed: false,
          },
        ];

        await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede
        const foundEvent = mockEvents.find(e => e.id === eventId);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Evento não encontrado.');
        }

      } catch (err) {
        setError('Não foi possível carregar os detalhes do evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubscription = () => {
    // Simula a troca de status de inscrição
    setEvent(prevEvent => ({ ...prevEvent, isSubscribed: !prevEvent.isSubscribed }));
    // Em um app real, você faria uma chamada de API aqui
    // api.post(`/api/events/${eventId}/subscribe`) ou /unsubscribe
  };

  if (loading) {
    return <div className="loading-container"><p>Carregando detalhes do evento...</p></div>;
  }

  if (error) {
    return <div className="error-container"><p className="error-message">{error}</p></div>;
  }

  if (!event) {
    return <div className="error-container"><p className="error-message">Evento não encontrado.</p></div>;
  }

  return (
    <div className="event-details-page">
      <Link to="/" className="back-link">← Voltar para a Home</Link>
      <div className="event-details-container">
        <img src={event.imageUrl} alt={event.title} className="event-image" />
        <div className="event-info">
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            <p className="event-date">
              📅 {new Date(event.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="event-location">
              📍 {event.location}
            </p>
          </div>
          <p className="event-description">{event.description}</p>
          <button
            onClick={handleSubscription}
            className={`subscribe-button ${event.isSubscribed ? 'subscribed' : ''}`}
          >
            {event.isSubscribed ? 'Cancelar Inscrição' : 'Inscrever-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;

