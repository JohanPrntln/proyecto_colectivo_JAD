// =======================================
// MIDDLEWARE: roles.js
// =======================================
// Verifica que el usuario tenga rol de administrador
// (role_id = 1 en la tabla roles)

function esAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  if (req.usuario.role_id !== 1) {
    return res.status(403).json({ mensaje: 'Se requieren permisos de administrador' });
  }
  next();
}

// Verifica que el usuario tenga rol de jefe o administrador
// (role_id = 2 o 1 en la tabla roles)
function esJefe(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  if (req.usuario.role_id !== 2 && req.usuario.role_id !== 1) {
    return res.status(403).json({ mensaje: 'Se requieren permisos de jefe o administrador' });
  }
  next();
}

module.exports = { esAdmin, esJefe };
