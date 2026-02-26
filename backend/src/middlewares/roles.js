// roles.js - Middlewares de autorización por roles
// Verifican el role_id del usuario autenticado para autorizar acceso a rutas específicas.

function esAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  if (req.usuario.role_id !== 1) {
    return res.status(403).json({ mensaje: 'Se requieren permisos de administrador' });
  }
  next(); // Usuario es admin, continúa
}

// Verifica que el usuario tenga rol de jefe o administrador
function esJefe(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }
  if (req.usuario.role_id !== 2 && req.usuario.role_id !== 1) {
    return res.status(403).json({ mensaje: 'Se requieren permisos de jefe o administrador' });
  }
  next(); // Usuario es jefe o admin, continúa
}

module.exports = { esAdmin, esJefe }; // Exporta los middlewares de roles
