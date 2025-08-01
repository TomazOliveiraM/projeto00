import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ eventId, comments, onCommentPosted }) => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('O comentário não pode estar vazio.');
      return;
    }
    setError('');

    try {
      const response = await api.post(`/events/${eventId}/comments`, {
        text: newComment,
        rating: rating > 0 ? rating : undefined,
      });
      onCommentPosted(response.data); // Atualiza o estado na página pai
      setNewComment('');
      setRating(0);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao postar comentário.');
      console.error(err);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comentários e Avaliações</h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário..."
            rows="3"
          />
          {/* Adicionar um componente de estrelas para avaliação seria ideal aqui */}
          <button type="submit">Postar Comentário</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}

      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p className="comment-author">
                <strong>{comment.author.name}</strong>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

