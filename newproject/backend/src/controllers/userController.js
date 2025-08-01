const Subscription = require('../models/Subscription');

// @desc    Get user's subscriptions
// @route   GET /api/users/:userId/subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    // Garante que o usuário logado só pode ver as próprias inscrições
    if (req.user.id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    const subscriptions = await Subscription.find({ user: req.params.userId }).populate({
      path: 'event',
      select: 'title date location imageUrl id' // Seleciona os campos do evento a serem retornados
    });

    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};