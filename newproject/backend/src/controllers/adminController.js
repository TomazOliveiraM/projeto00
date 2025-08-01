const User = require('../models/User');

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['participante', 'organizador', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Função inválida.' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.role = role;
    await user.save({ validateModifiedOnly: true }); // Evita re-criptografar a senha

    res.json({ message: 'Função do usuário atualizada com sucesso.', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};