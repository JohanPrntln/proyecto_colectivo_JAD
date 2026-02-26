// autenticar.js - Middleware de autenticación JWT
// Verifica el token JWT en el header Authorization y agrega datos del usuario a req.usuario.

const jwt = require('jsonwebtoken'); // Librería para verificar JWT
require('dotenv').config(); // Carga JWT_SECRET del .env

function autenticar(req, res, next) {
  const header = req.headers.authorization; // Obtiene el header Authorization

  // Si no hay token o no empieza con 'Bearer ', rechaza la request
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no provisto' });
  }

  const token = header.split(' ')[1]; // Extrae el token después de 'Bearer '
  try {
    // Verifica el token con la clave secreta
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // Agrega datos del usuario al request (id, correo, role_id, empleado_id)
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = autenticar; // Exporta el middleware para rutas protegidas

