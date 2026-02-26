// auditoriaModelo.js - Modelo para manejar registros de auditoría
// Este modelo inserta logs de acciones realizadas por usuarios en la tabla 'auditoria'.
// Se usa para rastrear cambios importantes como creación de solicitudes, nóminas, etc.

const { pool } = require("../config/db"); // Importa el pool de conexiones MySQL

async function registrarAccion({ usuario_id = null, accion = "", detalle = "" }) {
  const sql = "INSERT INTO auditoria (usuario_id, accion, detalle) VALUES (?, ?, ?)";
  const [result] = await pool.query(sql, [usuario_id, accion, detalle]);
  return result.insertId; // Retorna el ID del registro insertado
}

module.exports = { registrarAccion }; // Exporta la función para usarla en controladores
