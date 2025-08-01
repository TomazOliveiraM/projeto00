const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Event = require('../models/Event');

const router = express.Router();

// @route   GET /api/users/me/events
// @desc    Get events organized by the current user
// @access  Private
router.get('/me/events', protect, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({
      date: -1,
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route   GET /api/users/me/subscriptions
// @desc    Get events the current user is subscribed to
// @access  Private
router.get('/me/subscriptions', protect, async (req, res) => {
  try {
    // Find events where the user's ID is in the 'participants' array
    const events = await Event.find({ participants: req.user.id })
      .populate('organizer', 'name')
      .sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;

