// backend/src/routes/commentRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addComment,
  getCommentsByEvent,
  deleteComment,
} = require('../controllers/commentController');

// A opção { mergeParams: true } é crucial para que as rotas aninhadas
// consigam acessar os parâmetros da rota pai (como :eventId)
const router = express.Router({ mergeParams: true });

// @route   POST /api/events/:eventId/comments
// @desc    Adicionar um comentário
// @access  Private (Apenas para participantes do evento)
router.post(
  '/',
  [
    protect,
    authorize('participante', 'organizador', 'admin'),
    [check('text', 'O texto do comentário é obrigatório').not().isEmpty()],
  ],
  addComment
);

// @route   GET /api/events/:eventId/comments
// @desc    Obter comentários de um evento
// @access  Public
router.get('/', getCommentsByEvent);

// @route   DELETE /api/events/:eventId/comments/:commentId
// @desc    Deletar um comentário
// @access  Private (Autor do comentário ou Admin)
router.delete('/:commentId', [protect, authorize('admin', 'participante', 'organizador')], deleteComment);

module.exports = router;
