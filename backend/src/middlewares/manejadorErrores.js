// middleware para manejo centralizado de errores
// debe ir al final del stack de middlewares (app.use(manejadorErrores))

function manejadorErrores(err, req, res, next) {
  console.error("ERROR:", err);

  // Errores controlados (tienen status)
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errores de validación de express-validator
  if (err.array) { // si viniera un array de errores
    return res.status(400).json({ error: "Error de validación", details: err.array() });
  }

  // Error por defecto (500)
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = manejadorErrores;

