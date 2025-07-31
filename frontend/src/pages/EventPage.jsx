import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './EventPage.module.css';

const EventPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        // A API agora retorna os detalhes do evento e se o usuário logado está inscrito.
        const eventResponse = await api.get(`/events/${id}`);
        setEvent(eventResponse.data);
        setIsSubscribed(eventResponse.data.isSubscribed || false);

        // Busca os comentários do evento (isso pode ser mantido ou movido para outra chamada)
        const commentsResponse = await api.get(`/events/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (err) {
        console.error("Erro ao carregar o evento:", err);
        setError('Não foi possível carregar os detalhes do evento.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]); // A dependência de 'isAuthenticated' e 'user' não é mais necessária aqui.

  const handleSubscription = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubscribing(true);
    setError('');

    try {
      // O backend deve ter uma rota para lidar com esta requisição
      await api.post(`/events/${id}/subscribe`);
      setIsSubscribed(true);
    } catch (err) {
      console.error("Erro ao se inscrever:", err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao tentar se inscrever. Tente novamente.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) {
      setError('Por favor, escreva um comentário e selecione uma avaliação.');
      return;
    }

    setIsPostingComment(true);
    setError('');
    try {
      const response = await api.post(`/events/${id}/comments`, { text: newComment, rating: newRating });
      setComments([response.data, ...comments]); // Adiciona o novo comentário no topo
      setNewComment('');
      setNewRating(0);
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
      setError(err.response?.data?.message || 'Não foi possível enviar seu comentário.');
    } finally {
      setIsPostingComment(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!event) return <div className={styles.container}>Evento não encontrado.</div>;

  const canSubscribe = isAuthenticated && user.role === 'participante';

  return (
    <div className={styles.container}>
      <img src={event.imageUrl || 'https://via.placeholder.com/1200x400?text=Evento'} alt={event.title} className={styles.banner} />
      <div className={styles.content}>
        <h1 className={styles.title}>{event.title}</h1>
        <div className={styles.meta}>
          <span>📅 {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          <span>📍 {event.location}</span>
        </div>
        <p className={styles.description}>{event.description}</p>

        <div className={styles.actions}>
          {canSubscribe && (
            isSubscribed ? (
              <button className={styles.subscribedButton} disabled>Inscrito</button>
            ) : (
              <button onClick={handleSubscription} disabled={isSubscribing} className={styles.subscribeButton}>
                {isSubscribing ? 'Inscrevendo...' : 'Inscrever-se'}
              </button>
            )
          )}
          {!isAuthenticated && (
             <button onClick={() => navigate('/login')} className={styles.subscribeButton}>Faça login para se inscrever</button>
          )}
        </div>

        {/* Seção de Comentários */}
        <div className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Avaliações e Comentários</h2>
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <div className={styles.ratingInput}>
                <span>Sua Avaliação:</span>
                <div className={styles.stars}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <React.Fragment key={star}>
                      <input
                        type="radio"
                        id={`star${star}`}
                        name="rating"
                        value={star}
                        checked={newRating === star}
                        onChange={() => setNewRating(star)}
                      />
                      <label htmlFor={`star${star}`}>&#9733;</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe seu comentário..."
                className={styles.commentTextarea}
                rows="3"
                required
              />
              <button type="submit" disabled={isPostingComment} className={styles.commentSubmitButton}>
                {isPostingComment ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          ) : (
            <p className={styles.loginToComment}>
              <Link to="/login">Faça login</Link> para deixar um comentário.
            </p>
          )}

          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment._id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <strong className={styles.commentAuthor}>{comment.author?.name || 'Usuário'}</strong>
                    <span className={styles.commentRating}>{'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}</span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                  <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                </div>
              ))
            ) : (
              <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;