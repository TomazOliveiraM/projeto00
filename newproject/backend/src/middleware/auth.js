const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Adiciona o usuário ao objeto de requisição
      req.user = await User.findById(decoded.user.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

// Middleware para autorizar com base no papel (role)
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Usuário com papel '${req.user.role}' não tem permissão para acessar esta rota` });
  }
  next();
};