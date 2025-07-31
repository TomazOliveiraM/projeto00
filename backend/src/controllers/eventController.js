const Event = require('../models/Event');
const Subscription = require('../models/Subscription');
const Comment = require('../models/Comment');

// Helper para lidar com erros do servidor de forma consistente
const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Erro no servidor' });
};

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name');
    res.json(events);
  } catch (err) {
    handleServerError(res, err);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (err) {
    handleServerError(res, err);
  }
};

// @desc    Subscribe to an event
// @route   POST /api/events/:id/subscribe
exports.subscribeToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const existingSubscription = await Subscription.findOne({ event: req.params.id, user: req.user.id });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Você já está inscrito neste evento' });
    }

    const subscription = new Subscription({ event: req.params.id, user: req.user.id });
    await subscription.save();
    res.status(201).json({ message: 'Inscrição realizada com sucesso' });
  } catch (err) {
    handleServerError(res, err);
  }
};

// @desc    Get comments for an event
// @route   GET /api/events/:id/comments
exports.getEventComments = async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.id })
      .populate('author', 'name') // Popula com o nome do autor
      .sort({ createdAt: -1 }); // Mostra os mais recentes primeiro
    res.json(comments);
  } catch (err) {
    handleServerError(res, err);
  }
};

// @desc    Add a comment to an event
// @route   POST /api/events/:id/comments
exports.addEventComment = async (req, res) => {
  const { text, rating } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'O texto do comentário é obrigatório.' });
  }

  try {
    const newComment = new Comment({
      text: text.trim(),
      rating,
      event: req.params.id,
      author: req.user.id, // Vem do middleware 'protect'
    });

    const comment = await newComment.save();
    await comment.populate('author', 'name');

    res.status(201).json(comment);
  } catch (err) {
    handleServerError(res, err);
  }
};

// @desc    Create a new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      imageUrl,
      organizer: req.user.id, // ID do usuário logado (organizador)
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    handleServerError(res, err);
  }
};