// ==========================
// RUTAS DE EMPLEADOS
// ==========================
// Define las URLs (endpoints) para acceder al CRUD desde Postman o el frontend.

const express = require("express");
const router = express.Router();
const empleadoControlador = require("../controladores/empleadoControlador");
const autenticar = require("../middlewares/autenticar");
// Rutas del CRUD
router.get("/", empleadoControlador.listarEmpleados);        // Listar todos
router.get("/:id", empleadoControlador.obtenerEmpleado);      // Obtener uno
router.post("/", empleadoControlador.crearEmpleado);          // Crear
router.put("/:id", empleadoControlador.actualizarEmpleado);   // Actualizar
router.delete("/:id", empleadoControlador.eliminarEmpleado);

router.post("/", autenticar, empleadoControlador.crearEmpleado);
router.put("/:id", autenticar, empleadoControlador.actualizarEmpleado);
router.delete("/:id", autenticar, empleadoControlador.eliminarEmpleado);  // Eliminar lógico

module.exports = router;
