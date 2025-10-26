// ==========================
// CONTROLADOR DE EMPLEADOS
// ==========================
// Aquí se reciben las peticiones HTTP del frontend o Postman,
// se validan los datos y se llama al modelo para hacer la consulta.

const empleadoModelo = require("../modelos/empleadoModelo");

// Obtener todos
async function listarEmpleados(req, res) {
  try {
    const empleados = await empleadoModelo.obtenerEmpleados();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener empleados", error });
  }
}

// Obtener uno por ID
async function obtenerEmpleado(req, res) {
  try {
    const { id } = req.params;
    const empleado = await empleadoModelo.obtenerEmpleadoPorId(id);
    if (!empleado) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener empleado", error });
  }
}

// Crear nuevo
async function crearEmpleado(req, res) {
  try {
    const nuevoId = await empleadoModelo.crearEmpleado(req.body);
    res.status(201).json({ mensaje: "Empleado creado", id: nuevoId });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear empleado", error });
  }
}

// Actualizar
async function actualizarEmpleado(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await empleadoModelo.actualizarEmpleado(id, req.body);
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }
    res.json({ mensaje: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar empleado", error });
  }
}

// Eliminar (lógicamente)
async function eliminarEmpleado(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await empleadoModelo.eliminarEmpleado(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }
    res.json({ mensaje: "Empleado marcado como inactivo" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar empleado", error });
  }
}

module.exports = {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
};
