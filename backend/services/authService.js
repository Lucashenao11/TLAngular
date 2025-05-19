const jwt = require('jsonwebtoken');

const authService = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userNombreUsuario = decoded.nombreUsuario;
    if (!req.userNombreUsuario) {
      return res.status(401).json({ message: 'Token no contiene nombreUsuario.' });
    }
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authService;