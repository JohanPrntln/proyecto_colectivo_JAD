// nominaRutas.js - Rutas para gestión de nóminas
// Define rutas protegidas para generar, listar, obtener y eliminar nóminas.

const express = require('express'); // Framework para rutas
const router = express.Router(); // Instancia del router
const autenticar = require('../middlewares/autenticar'); // Middleware de autenticación
const { esAdmin, esJefe } = require('../middlewares/roles'); // Middlewares de roles
const { generarNomina, listarNominas, obtenerNomina, eliminarNomina, listarMisNominas } = require('../controladores/nominaControlador'); // Controlador de nóminas

// Generar nómina - solo admin o jefe
router.post('/generar', autenticar, esJefe, generarNomina); // POST /api/nominas/generar

// Listar nóminas - todos autenticados
router.get('/', autenticar, listarNominas); // GET /api/nominas

// Listar nóminas del empleado actual
router.get('/mias', autenticar, listarMisNominas); // GET /api/nominas/mias

// Obtener nómina por ID - todos autenticados
router.get('/:id', autenticar, obtenerNomina); // GET /api/nominas/:id

// Eliminar nómina - solo admin o jefe (opcional)
router.delete('/:id', autenticar, esJefe, eliminarNomina); // DELETE /api/nominas/:id

module.exports = router; // Exporta el router para app.js
