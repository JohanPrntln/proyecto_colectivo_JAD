// ==========================
// MODELO DE EMPLEADOS
// ==========================
// Este archivo se encarga de las consultas SQL hacia la tabla empleados.
// Se importa el pool (conexión) y se exportan funciones para cada operación CRUD.

const { pool } = require("../config/db");

// Obtener todos los empleados
async function obtenerEmpleados() {
  const [filas] = await pool.query("SELECT * FROM empleados");
  return filas;
}

// Obtener un empleado por ID
async function obtenerEmpleadoPorId(id) {
  const [filas] = await pool.query("SELECT * FROM empleados WHERE id = ?", [id]);
  return filas[0];
}

// Crear nuevo empleado
async function crearEmpleado(datos) {
  const { nombre_completo, documento, cargo, area, fecha_ingreso, estado } = datos;
  const [resultado] = await pool.query(
    "INSERT INTO empleados (nombre_completo, documento, cargo, area, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre_completo, documento, cargo, area, fecha_ingreso, estado || "activo"]
  );
  return resultado.insertId;
}

// Actualizar un empleado
async function actualizarEmpleado(id, datos) {
  const { nombre_completo, documento, cargo, area, fecha_ingreso, estado } = datos;
  const [resultado] = await pool.query(
    "UPDATE empleados SET nombre_completo=?, documento=?, cargo=?, area=?, fecha_ingreso=?, estado=? WHERE id=?",
    [nombre_completo, documento, cargo, area, fecha_ingreso, estado, id]
  );
  return resultado.affectedRows;
}

// Eliminar un empleado (eliminación lógica)
async function eliminarEmpleado(id) {
  const [resultado] = await pool.query("UPDATE empleados SET estado='inactivo' WHERE id=?", [id]);
  return resultado.affectedRows;
}
// Añadimos buscar por documento

async function buscarPorDocumento(documento) {
  const [filas] = await pool.query("SELECT * FROM empleados WHERE documento = ?", [documento]);
  return filas[0];
}

module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  buscarPorDocumento
};