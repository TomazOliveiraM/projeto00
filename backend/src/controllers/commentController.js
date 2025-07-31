const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Event = require('../models/Event');

// @desc    Adicionar um comentário a um evento
// @route   POST /api/events/:eventId/comments
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventId } = req.params;
  const { text, rating } = req.body;
  const authorId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    // Regra de negócio: Apenas participantes podem comentar.
    if (!event.participants.some(p => p.equals(authorId))) {
      return res.status(403).json({ msg: 'Apenas participantes podem comentar no evento.' });
    }

    // Regra de negócio: Um usuário só pode comentar uma vez.
    const existingComment = await Comment.findOne({ event: eventId, author: authorId });
    if (existingComment) {
      return res.status(400).json({ msg: 'Você já comentou neste evento.' });
    }

    const newComment = new Comment({
      text,
      rating,
      author: authorId,
      event: eventId,
    });

    const comment = await newComment.save();
    // Popula o autor para retornar o nome no frontend
    await comment.populate('author', 'name');
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
};

// @desc    Obter todos os comentários de um evento
// @route   GET /api/events/:eventId/comments
exports.getCommentsByEvent = async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
};

// @desc    Deletar um comentário
// @route   DELETE /api/events/:eventId/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comentário não encontrado' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Usuário não autorizado' });
    }

    await comment.deleteOne();
    res.json({ msg: 'Comentário removido' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
};

