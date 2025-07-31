const express = require('express');
const router = express.Router();
const { getUserSubscriptions } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Rota protegida para buscar as inscrições do usuário
router.route('/:userId/subscriptions').get(protect, getUserSubscriptions);

module.exports = router;