// ==========================
// MODELO DE SOLICITUDES
// ==========================
// Se encarga de interactuar con la base de datos MySQL para CRUD de solicitudes.
// Incluye JOIN con empleados y usuarios para datos relacionados.

const { pool } = require("../config/db"); // Importa el pool de conexiones MySQL

// Obtener todas las solicitudes (para RRHH o jefe) con JOIN a empleados y revisor
async function obtenerSolicitudes() {
  const [rows] = await pool.query(`
    SELECT s.*, e.nombre_completo, e.area, u.correo AS revisado_por_correo
    FROM solicitudes s
    JOIN empleados e ON s.empleado_id = e.id
    LEFT JOIN usuarios u ON s.revisado_por = u.id
    ORDER BY s.fecha_creacion DESC
  `);
  return rows; // Retorna lista de solicitudes con datos de empleado y revisor
}

// Obtener solicitudes de un empleado específico
async function obtenerSolicitudesPorEmpleado(empleadoId) {
  const [rows] = await pool.query(
    "SELECT * FROM solicitudes WHERE empleado_id = ? ORDER BY fecha_creacion DESC",
    [empleadoId]
  );
  return rows; // Retorna solicitudes del empleado logueado
}

// Crear nueva solicitud
async function crearSolicitud(datos) {
  const {
    empleado_id,
    tipo,
    fecha_inicio,
    fecha_fin,
    dias_solicitados,
    motivo,
    soporte,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO solicitudes
      (empleado_id, tipo, fecha_inicio, fecha_fin, dias_solicitados, motivo, soporte)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [empleado_id, tipo, fecha_inicio, fecha_fin, dias_solicitados, motivo, soporte]
  );

  return resultado.insertId; // Retorna el ID de la nueva solicitud
}

// Aprobar o rechazar solicitud (actualiza estado, revisado_por, fecha_revision, remunerado)
async function actualizarEstadoSolicitud(id, estado, revisado_por, remunerado) {
  const [resultado] = await pool.query(
    `UPDATE solicitudes
     SET estado = ?, revisado_por = ?, fecha_revision = NOW(), remunerado = ?
     WHERE id = ?`,
    [estado, revisado_por, remunerado, id]
  );
  return resultado.affectedRows > 0; // Retorna true si se actualizó al menos una fila
}

module.exports = {
  obtenerSolicitudes,
  obtenerSolicitudesPorEmpleado,
  crearSolicitud,
  actualizarEstadoSolicitud,
}; // Exporta las funciones para usar en controladores
