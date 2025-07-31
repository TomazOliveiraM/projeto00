import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import styles from './CreateEventForm.module.css';

// Schema de validação com Yup
const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .required('O título é obrigatório'),
  description: Yup.string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .required('A descrição é obrigatória'),
  date: Yup.date()
    .min(new Date(), 'A data não pode ser no passado')
    .required('A data é obrigatória'),
  category: Yup.string()
    .required('A categoria é obrigatória'),
});

const CreateEventForm = ({ onEventCreated }) => {
  const initialValues = {
    title: '',
    description: '',
    date: '',
    category: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      setStatus(null);
      const response = await api.post('/events', values);
      onEventCreated(response.data.data || response.data); // Chama o callback do pai
      resetForm();
      alert('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      const errorMessage = error.response?.data?.message || 'Falha ao criar o evento. Tente novamente.';
      setStatus(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>Criar Novo Evento</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título do Evento</label>
              <Field type="text" name="title" id="title" className={styles.formField} />
              <ErrorMessage name="title" component="div" className={styles.errorMessage} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição</label>
              <Field as="textarea" name="description" id="description" rows="4" className={styles.formField} />
              <ErrorMessage name="description" component="div" className={styles.errorMessage} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Data e Hora</label>
              <Field type="datetime-local" name="date" id="date" className={styles.formField} />
              <ErrorMessage name="date" component="div" className={styles.errorMessage} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Categoria</label>
              <Field type="text" name="category" id="category" placeholder="Ex: Tecnologia, Música, Esportes" className={styles.formField} />
              <ErrorMessage name="category" component="div" className={styles.errorMessage} />
            </div>

            {status && <div className={styles.formError}>{status}</div>}

            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Criando...' : 'Criar Evento'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEventForm;