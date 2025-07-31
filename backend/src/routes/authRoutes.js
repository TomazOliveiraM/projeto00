const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Registrar um usuário
// @access  Public
router.post(
  '/register',
  [
    check('name', 'O nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um e-mail válido').isEmail(),
    check('password', 'Por favor, insira uma senha com 6 ou mais caracteres').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Usuário já existe' }] });
      }

      user = new User({ name, email, password, role });
      await user.save();

      const payload = { user: { id: user.id, role: user.role } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   POST api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um e-mail válido').isEmail(),
    check('password', 'A senha é obrigatória').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }

      const payload = { user: { id: user.id, role: user.role } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   GET /api/auth/google
// @desc    Autenticar com o Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @route   GET /api/auth/google/callback
// @desc    Callback do Google OAuth
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    // Autenticação bem-sucedida, o usuário está em req.user
    // Agora, geramos nosso próprio token JWT para ele
    const payload = {
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Redireciona para o frontend com o token na URL
        // O frontend irá ler o token e salvar para uso futuro
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
      }
    );
  }
);

module.exports = router;
