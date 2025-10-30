// =======================================
// RUTAS: usuarioRutas.js
// =======================================
// Aquí definimos los endpoints para gestionar usuarios.
// Solo el administrador puede crear nuevos usuarios.

const express = require('express');
const { crearUsuarioYEmpleado, listarUsuarios } = require('../controladores/usuarioControlador');
const autenticar = require('../middlewares/autenticar');
const { esAdmin } = require('../middlewares/roles');

const router = express.Router();

// POST -> crear usuario y empleado
router.post('/', autenticar, esAdmin, crearUsuarioYEmpleado);

// GET -> listar usuarios (solo admin)
router.get('/', autenticar, esAdmin, listarUsuarios);

module.exports = router;
