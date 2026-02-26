// empleadoRutas.js - Rutas para gestión de empleados
// Define las rutas protegidas para CRUD de empleados, requiere autenticación.

const express = require("express"); // Framework para rutas
const router = express.Router(); // Instancia del router
const empleadoControlador = require("../controladores/empleadoControlador"); // Controlador de empleados
const autenticar = require("../middlewares/autenticar"); // Middleware de autenticación

// Rutas protegidas para CRUD de empleados
router.get("/", autenticar, empleadoControlador.listarEmpleados);        // GET /api/empleados - Listar todos
router.get("/:id", autenticar, empleadoControlador.obtenerEmpleado);      // GET /api/empleados/:id - Obtener uno
router.post("/", autenticar, empleadoControlador.crearEmpleado);          // POST /api/empleados - Crear
router.put("/:id", autenticar, empleadoControlador.actualizarEmpleado);   // PUT /api/empleados/:id - Actualizar
router.delete("/:id", autenticar, empleadoControlador.eliminarEmpleado);  // DELETE /api/empleados/:id - Eliminar lógico

module.exports = router; // Exporta el router para app.js

