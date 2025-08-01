import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './EventFormPage.module.css';

const EventFormPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // A API deve retornar o evento recém-criado
      const response = await api.post('/events', formData);
      // Redireciona para a página do novo evento
      navigate(`/events/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao criar o evento.');
      console.error('Erro ao criar evento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Criar Novo Evento</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="title">Título</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Descrição</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="date">Data e Hora</label>
          <input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="location">Localização</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="imageUrl">URL da Imagem (Opcional)</label>
          <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Criando...' : 'Criar Evento'}
        </button>
      </form>
    </div>
  );
};

export default EventFormPage;