const jwt = require("jsonwebtoken");
require("dotenv").config();

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // No token: podemos permitir acceso de lectura (GET) o devolver 401 según necesites.
    req.usuario = null;
    return next();
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "un_secreto_para_dev");
    // payload debe incluir id y role (ej: { id: 1, role: 'Administrador' })
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = autenticar;

