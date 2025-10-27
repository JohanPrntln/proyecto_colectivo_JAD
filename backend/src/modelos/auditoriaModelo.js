// Modelo para insertar registros de auditoría
const { pool } = require("../config/db");

async function registrarAccion({ usuario_id = null, accion = "", detalle = "" }) {
  const sql = "INSERT INTO auditoria (usuario_id, accion, detalle) VALUES (?, ?, ?)";
  const [result] = await pool.query(sql, [usuario_id, accion, detalle]);
  return result.insertId;
}

module.exports = { registrarAccion };
