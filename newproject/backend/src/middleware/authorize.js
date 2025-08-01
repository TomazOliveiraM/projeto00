// backend/src/middleware/authorize.js
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user é definido no middleware de autenticação (auth.js)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado: permissão insuficiente' });
    }
    next();
  };
};

module.exports = authorize;
