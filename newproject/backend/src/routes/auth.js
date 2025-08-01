const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajuste o caminho

const router = express.Router();

// Função para gerar o token JWT
const generateToken = (user) => {
  return jwt.sign({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Rota de Registro Local: POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }
    user = new User({ name, email, password });
    await user.save();
    
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de Login Local: POST /api/auth/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    const token = generateToken(user);
    return res.json({ token });
  })(req, res, next);
});

// Rota de Início do Login com Google: GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota de Callback do Google: GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redireciona para o callback do frontend com o token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=`);
  }
);

module.exports = router;
