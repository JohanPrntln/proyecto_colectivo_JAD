// authRutas.js - Rutas para autenticación (login y registro)
// Define las rutas públicas para login y registro de usuarios.

const express = require('express'); // Framework para crear rutas
const router = express.Router(); // Instancia del router de Express
const { login, registrar } = require('../controladores/authControlador'); // Importa funciones del controlador

// Ruta para login: POST /api/auth/login
router.post('/login', login);

// Ruta para registro: POST /api/auth/register
router.post('/register', registrar);

module.exports = router; // Exporta el router para usar en app.js
