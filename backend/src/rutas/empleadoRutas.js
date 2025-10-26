// ==========================
// RUTAS DE EMPLEADOS
// ==========================
// Define las URLs (endpoints) para acceder al CRUD desde Postman o el frontend.

const express = require("express");
const router = express.Router();
const empleadoControlador = require("../controladores/empleadoControlador");

// Rutas del CRUD
router.get("/", empleadoControlador.listarEmpleados);        // Listar todos
router.get("/:id", empleadoControlador.obtenerEmpleado);      // Obtener uno
router.post("/", empleadoControlador.crearEmpleado);          // Crear
router.put("/:id", empleadoControlador.actualizarEmpleado);   // Actualizar
router.delete("/:id", empleadoControlador.eliminarEmpleado);  // Eliminar lógico

module.exports = router;
