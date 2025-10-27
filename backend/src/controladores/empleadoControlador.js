// ==========================
// CONTROLADOR DE EMPLEADOS (mejorado, con validaciones y auditoría opcional)
// ==========================

const { validationResult, body, param } = require("express-validator");
const empleadoModelo = require("../modelos/empleadoModelo");

// Intentamos cargar el modelo de auditoría si existe (no obligatorio aún)
let auditoriaModelo = null;
try {
  auditoriaModelo = require("../modelos/auditoriaModelo");
} catch (err) {
  // si no existe, no hacemos nada; el controlador seguirá funcionando
  auditoriaModelo = null;
}

// VALIDADORES exportables (úsalos en las rutas)
const validarCrearEmpleado = [
  body("nombre_completo").isString().notEmpty().withMessage("nombre_completo es obligatorio"),
  body("documento").isString().notEmpty().withMessage("documento es obligatorio"),
  body("cargo").optional().isString(),
  body("area").optional().isString(),
  body("fecha_ingreso").optional().isISO8601().withMessage("fecha_ingreso debe ser YYYY-MM-DD"),
];

const validarIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("id debe ser entero positivo")
];

// -----------------------
// Listar empleados
// -----------------------
async function listarEmpleados(req, res, next) {
  try {
    const empleados = await empleadoModelo.obtenerEmpleados();
    return res.json(empleados);
  } catch (error) {
    next(error);
  }
}

// -----------------------
// Obtener empleado por ID
// -----------------------
async function obtenerEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const empleado = await empleadoModelo.obtenerEmpleadoPorId(id);
    if (!empleado) return res.status(404).json({ mensaje: "Empleado no encontrado" });
    return res.json(empleado);
  } catch (error) {
    next(error);
  }
}

// -----------------------
// Crear nuevo empleado
// -----------------------
async function crearEmpleado(req, res, next) {
  try {
    // validaciones de express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const datos = req.body;

    // Si el modelo implementa buscarPorDocumento, comprobamos duplicado
    if (typeof empleadoModelo.buscarPorDocumento === "function") {
      const existente = await empleadoModelo.buscarPorDocumento(datos.documento);
      if (existente) return res.status(409).json({ mensaje: "Ya existe un empleado con ese documento" });
    }

    const nuevoId = await empleadoModelo.crearEmpleado(datos);

    // Registrar auditoría si el modelo existe
    try {
      if (auditoriaModelo && typeof auditoriaModelo.registrarAccion === "function") {
        const usuario_id = req.usuario ? req.usuario.id : null;
        await auditoriaModelo.registrarAccion({
          usuario_id,
          accion: "CREAR_EMPLEADO",
          detalle: `Empleado ID ${nuevoId} creado. documento=${datos.documento}`
        });
      }
    } catch (errAud) {
      console.warn("Warning: no se pudo registrar auditoría:", errAud.message || errAud);
      // No interrumpimos el flujo principal por fallo en auditoría
    }

    return res.status(201).json({ mensaje: "Empleado creado", id: nuevoId });
  } catch (error) {
    next(error);
  }
}

// -----------------------
// Actualizar empleado
// -----------------------
async function actualizarEmpleado(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { id } = req.params;
    const datos = req.body;

    const existe = await empleadoModelo.obtenerEmpleadoPorId(id);
    if (!existe) return res.status(404).json({ mensaje: "Empleado no encontrado" });

    // Si cambia documento, comprobar duplicado (si la función existe)
    if (datos.documento && datos.documento !== existe.documento && typeof empleadoModelo.buscarPorDocumento === "function") {
      const otro = await empleadoModelo.buscarPorDocumento(datos.documento);
      if (otro) return res.status(409).json({ mensaje: "Otro empleado ya usa ese documento" });
    }

    const actualizado = await empleadoModelo.actualizarEmpleado(id, datos);
    if (!actualizado) return res.status(400).json({ mensaje: "No se actualizó el empleado" });

    // Auditoría
    try {
      if (auditoriaModelo && typeof auditoriaModelo.registrarAccion === "function") {
        const usuario_id = req.usuario ? req.usuario.id : null;
        await auditoriaModelo.registrarAccion({
          usuario_id,
          accion: "ACTUALIZAR_EMPLEADO",
          detalle: `Empleado ID ${id} actualizado.`
        });
      }
    } catch (errAud) {
      console.warn("Warning: no se pudo registrar auditoría:", errAud.message || errAud);
    }

    return res.json({ mensaje: "Empleado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

// -----------------------
// Eliminar (lógico) empleado
// -----------------------
async function eliminarEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const existe = await empleadoModelo.obtenerEmpleadoPorId(id);
    if (!existe) return res.status(404).json({ mensaje: "Empleado no encontrado" });

    const eliminado = await empleadoModelo.eliminarEmpleado(id);
    if (!eliminado) return res.status(400).json({ mensaje: "No se pudo eliminar el empleado" });

    // Auditoría
    try {
      if (auditoriaModelo && typeof auditoriaModelo.registrarAccion === "function") {
        const usuario_id = req.usuario ? req.usuario.id : null;
        await auditoriaModelo.registrarAccion({
          usuario_id,
          accion: "ELIMINAR_EMPLEADO",
          detalle: `Empleado ID ${id} marcado como inactivo`
        });
      }
    } catch (errAud) {
      console.warn("Warning: no se pudo registrar auditoría:", errAud.message || errAud);
    }

    return res.json({ mensaje: "Empleado marcado como inactivo" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  validarCrearEmpleado,
  validarIdParam
};

