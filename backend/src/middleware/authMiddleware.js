const jwt = require('jsonwebtoken');

// Middleware para proteger rotas verificando o token JWT
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obter token do cabeçalho (formato: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anexar o payload do usuário (id, role) ao objeto req
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Não autorizado, sem token' });
  }
};

// Middleware para autorizar com base no papel (role)
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ msg: `O papel '${req.user.role}' não tem permissão para acessar esta rota` });
  }
  next();
};

module.exports = { protect, authorize };

