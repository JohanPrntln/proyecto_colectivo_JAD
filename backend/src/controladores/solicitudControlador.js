// ==========================
// CONTROLADOR DE SOLICITUDES
// ==========================
// Recibe las solicitudes HTTP del frontend y llama al modelo.
// Incluye validaciones y manejo de errores.

const solicitudModelo = require("../modelos/solicitudModelo");
const { pool } = require("../config/db");

// Listar todas (solo RRHH o jefe)
async function listarSolicitudes(req, res) {
  try {
    const solicitudes = await solicitudModelo.obtenerSolicitudes();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    res.status(500).json({ mensaje: "Error al listar solicitudes" });
  }
}

// Listar solo las del empleado logueado
async function listarSolicitudesEmpleado(req, res) {
  try {
    const empleadoId = req.usuario?.empleado_id; // del token
    if (!empleadoId)
      return res.status(403).json({ mensaje: "Empleado no identificado" });

    const solicitudes = await solicitudModelo.obtenerSolicitudesPorEmpleado(empleadoId);
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al listar solicitudes del empleado:", error);
    res.status(500).json({ mensaje: "Error al listar solicitudes del empleado" });
  }
}

// Crear una solicitud
async function crearSolicitud(req, res) {
  try {
    if (!req.usuario || !req.usuario.empleado_id) {
      return res.status(403).json({ mensaje: "Empleado no identificado en el token" });
    }
    const nuevaSolicitud = await solicitudModelo.crearSolicitud({
      empleado_id: req.usuario.empleado_id,
      ...req.body
    });

    // Registrar auditoría
    await pool.query(
      `INSERT INTO auditoria (usuario_id, accion, detalle)
       VALUES (?, 'Creación de solicitud', 'ID solicitud: ${nuevaSolicitud}')`,
      [req.usuario?.id || null]
    );

    res.status(201).json({ mensaje: "Solicitud creada correctamente", id: nuevaSolicitud });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ mensaje: "Error al crear solicitud" });
  }
}

// Aprobar o rechazar solicitud
async function actualizarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado, remunerado } = req.body;

    const ok = await solicitudModelo.actualizarEstadoSolicitud(
      id,
      estado,
      req.usuario?.id || null,
      remunerado
    );

    if (!ok) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    // Registrar en auditoría
    await pool.query(
      `INSERT INTO auditoria (usuario_id, accion, detalle)
       VALUES (?, 'Cambio de estado de solicitud', 'Solicitud ${id} -> ${estado}')`,
      [req.usuario?.id || null]
    );

    res.json({ mensaje: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado de solicitud:", error);
    res.status(500).json({ mensaje: "Error al actualizar estado" });
  }
}

module.exports = {
  listarSolicitudes,
  listarSolicitudesEmpleado,
  crearSolicitud,
  actualizarEstado,
};
