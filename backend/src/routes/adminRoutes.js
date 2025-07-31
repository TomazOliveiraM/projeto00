const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;

