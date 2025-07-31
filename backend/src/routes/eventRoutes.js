const express = require('express');
const { check, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const Event = require('../models/Event');

const router = express.Router();

// @route   GET api/events
// @desc    Listar todos os eventos
// @access  Public
router.get('/', async (req, res) => {
  try {
    // .populate() busca os dados do organizador referenciado, selecionando apenas nome e email
    const events = await Event.find().populate('organizer', 'name email').sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   GET api/events/:id
// @desc    Obter um evento pelo ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    // Se o ID for inválido, retorna 404 também
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route   POST api/events
// @desc    Criar um evento
// @access  Private (Apenas para 'organizador' e 'admin')
router.post(
  '/',
  [
    protect, // 1. Verifica se o usuário está logado (tem um token válido)
    authorize('organizador', 'admin'), // 2. Verifica se o usuário tem o papel permitido
    check('title', 'O título é obrigatório').not().isEmpty(),
    check('description', 'A descrição é obrigatória').not().isEmpty(),
    check('date', 'Uma data válida é obrigatória').isISO8601().toDate(),
    check('location', 'A localização é obrigatória').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location } = req.body;

    try {
      const newEvent = new Event({
        title,
        description,
        date,
        location,
        organizer: req.user.id, // O ID do usuário vem do token decodificado no middleware 'protect'
      });

      const event = await newEvent.save();
      res.status(201).json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Atualizar um evento
// @access  Private (Apenas o dono do evento ou um 'admin')
router.put(
  '/:id',
  [
    protect,
    authorize('organizador', 'admin'),
    check('title', 'O título não pode ser vazio').optional().not().isEmpty(),
    check('description', 'A descrição não pode ser vazia').optional().not().isEmpty(),
    check('date', 'A data deve ser válida').optional().isISO8601().toDate(),
    check('location', 'A localização não pode ser vazia').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ msg: 'Evento não encontrado' });
      }

      // Verifica se o usuário logado é o organizador do evento ou um admin
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Usuário não autorizado' });
      }

      // Atualiza o evento com os novos dados
      event = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route   DELETE api/events/:id
// @desc    Deletar um evento
// @access  Private (Apenas o dono do evento ou um 'admin')
router.delete('/:id', [protect, authorize('organizador', 'admin')], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    // Verifica se o usuário logado é o organizador do evento ou um admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Usuário não autorizado' });
    }

    await event.deleteOne();

    res.json({ msg: 'Evento removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   POST api/events/:id/subscribe
// @desc    Inscrever-se em um evento
// @access  Private (Apenas 'participante')
router.post('/:id/subscribe', [protect, authorize('participante')], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    // Verifica se o usuário já está inscrito
    if (event.participants.some(participant => participant.equals(req.user.id))) {
      return res.status(400).json({ msg: 'Usuário já está inscrito neste evento' });
    }

    event.participants.push(req.user.id);
    await event.save();

    // Retorna o evento atualizado para o frontend
    const updatedEvent = await Event.findById(req.params.id).populate('organizer', 'name email');
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   DELETE api/events/:id/subscribe
// @desc    Cancelar inscrição de um evento
// @access  Private (Apenas 'participante')
router.delete('/:id/subscribe', [protect, authorize('participante')], async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    // Verifica se o usuário está inscrito para poder cancelar
    if (!event.participants.some(participant => participant.equals(req.user.id))) {
      return res.status(400).json({ msg: 'Usuário não está inscrito neste evento' });
    }

    event.participants = event.participants.filter(
      participant => !participant.equals(req.user.id)
    );

    await event.save();

    const updatedEvent = await Event.findById(req.params.id).populate('organizer', 'name email');
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   GET api/events/:id/participants
// @desc    Listar participantes de um evento
// @access  Private (Organizador ou Admin)
router.get('/:id/participants', [protect, authorize('organizador', 'admin')], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'name email');

    if (!event) {
      return res.status(404).json({ msg: 'Evento não encontrado' });
    }

    res.json(event.participants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;
