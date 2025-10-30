// ==========================
// RUTAS DE EMPLEADOS
// ==========================
// Define las URLs (endpoints) para acceder al CRUD desde Postman o el frontend.

const express = require("express");
const router = express.Router();
const empleadoControlador = require("../controladores/empleadoControlador");
const autenticar = require("../middlewares/autenticar");
// Rutas del CRUD con autenticar para seguridad
router.get("/", autenticar, empleadoControlador.listarEmpleados);        // Listar todos
router.get("/:id", autenticar, empleadoControlador.obtenerEmpleado);      // Obtener uno
router.post("/", autenticar, empleadoControlador.crearEmpleado);          // Crear
router.put("/:id", autenticar, empleadoControlador.actualizarEmpleado);   // Actualizar
router.delete("/:id", autenticar, empleadoControlador.eliminarEmpleado);  // Eliminar lógico

module.exports = router;

