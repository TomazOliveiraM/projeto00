const express = require('express');
const router = express.Router();
const { updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Todas as rotas aqui são protegidas e só podem ser acessadas por administradores
router.use(protect, authorize('admin'));

router.route('/users/:id/role').put(updateUserRole);

module.exports = router;