// manejadorErrores.js - Middleware global para manejo centralizado de errores
// Captura errores no manejados en la aplicación Express, debe ir al final del stack.

function manejadorErrores(err, req, res, next) {
  console.error("ERROR:", err); // Loggea el error en consola para debugging

  // Errores controlados (tienen propiedad status personalizada)
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errores de validación de express-validator (devuelven array de errores)
  if (err.array) { // Si el error tiene método array() (típico de express-validator)
    return res.status(400).json({ error: "Error de validación", details: err.array() });
  }

  // Error por defecto para errores no controlados (500 Internal Server Error)
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = manejadorErrores; // Exporta el middleware para app.js

