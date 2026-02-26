// usuarioRutas.js - Rutas para gestión de usuarios
// Define rutas protegidas para crear y listar usuarios, solo accesibles por admin.

const express = require('express'); // Framework para rutas
const { crearUsuarioYEmpleado, listarUsuarios } = require('../controladores/usuarioControlador'); // Controlador de usuarios
const autenticar = require('../middlewares/autenticar'); // Middleware de autenticación
const { esAdmin } = require('../middlewares/roles'); // Middleware de roles

const router = express.Router(); // Instancia del router

// POST -> crear usuario y empleado (solo admin)
router.post('/', autenticar, esAdmin, crearUsuarioYEmpleado); // POST /api/usuarios

// GET -> listar usuarios (solo admin)
router.get('/', autenticar, esAdmin, listarUsuarios); // GET /api/usuarios

module.exports = router; // Exporta el router para app.js
