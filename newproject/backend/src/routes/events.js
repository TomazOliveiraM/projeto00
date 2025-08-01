const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  subscribeToEvent,
  getEventComments,
  addEventComment,
  createEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Rotas Públicas
router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('admin', 'organizador'), createEvent);
router.route('/:id').get(getEventById);

// Rotas Privadas (só para participantes logados)
router.route('/:id/subscribe').post(protect, authorize('participante'), subscribeToEvent);

// Rotas de Comentários
router.route('/:id/comments')
  .get(getEventComments)
  .post(protect, addEventComment); // Apenas usuários autenticados podem comentar

module.exports = router;