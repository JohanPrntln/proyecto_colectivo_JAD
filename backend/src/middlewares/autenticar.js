// =======================================
// MIDDLEWARE: autenticar.js
// =======================================
// Este middleware verifica el token JWT enviado por el frontend
// y, si es válido, agrega la información del usuario a req.usuario.

const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticar(req, res, next) {
  const header = req.headers.authorization;

  // Si no hay token, rechazamos
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no provisto' });
  }

  const token = header.split(' ')[1];
  try {
    // Verificamos el token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, correo, role_id }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = autenticar;

