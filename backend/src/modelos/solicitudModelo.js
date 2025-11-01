// ==========================
// MODELO DE SOLICITUDES
// ==========================
// Se encarga de interactuar con la base de datos MySQL para CRUD de solicitudes.

const { pool } = require("../config/db");

// Obtener todas las solicitudes (para RRHH o jefe)
async function obtenerSolicitudes() {
  const [rows] = await pool.query(`
    SELECT s.*, e.nombre_completo, e.area, u.correo AS revisado_por_correo
    FROM solicitudes s
    JOIN empleados e ON s.empleado_id = e.id
    LEFT JOIN usuarios u ON s.revisado_por = u.id
    ORDER BY s.fecha_creacion DESC
  `);
  return rows;
}

// Obtener solicitudes de un empleado específico
async function obtenerSolicitudesPorEmpleado(empleadoId) {
  const [rows] = await pool.query(
    "SELECT * FROM solicitudes WHERE empleado_id = ? ORDER BY fecha_creacion DESC",
    [empleadoId]
  );
  return rows;
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

  return resultado.insertId;
}

// Aprobar o rechazar solicitud
async function actualizarEstadoSolicitud(id, estado, revisado_por, remunerado) {
  const [resultado] = await pool.query(
    `UPDATE solicitudes
     SET estado = ?, revisado_por = ?, fecha_revision = NOW(), remunerado = ?
     WHERE id = ?`,
    [estado, revisado_por, remunerado, id]
  );
  return resultado.affectedRows > 0;
}

module.exports = {
  obtenerSolicitudes,
  obtenerSolicitudesPorEmpleado,
  crearSolicitud,
  actualizarEstadoSolicitud,
};
