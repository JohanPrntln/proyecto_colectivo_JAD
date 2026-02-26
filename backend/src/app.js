// app.js - Configuración principal de la aplicación Express para JAD
// Configura Express, importa rutas y middlewares, define endpoint raíz.

const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para CORS

const authRutas = require('./rutas/authRutas'); // Rutas de autenticación
const empleadoRutas = require('./rutas/empleadoRutas'); // Rutas de empleados
const solicitudRutas = require('./rutas/solicitudRutas'); // Rutas de solicitudes
const nominaRutas = require('./rutas/nominaRutas'); // Rutas de nóminas
const manejadorErrores = require('./middlewares/manejadorErrores'); // Middleware de errores
const usuarioRutas = require('./rutas/usuarioRutas'); // Rutas de usuarios

const app = express(); // Instancia de Express
app.use(cors()); // Habilita CORS
app.use(express.json()); // Parsea JSON

// Registro de rutas
app.use('/api/auth', authRutas); // /api/auth
app.use('/api/empleados', empleadoRutas); // /api/empleados
app.use('/api/solicitudes', solicitudRutas); // /api/solicitudes
app.use('/api/nominas', nominaRutas); // /api/nominas
app.use('/api/usuarios', usuarioRutas); // /api/usuarios

// Endpoint raíz
app.get('/', (req, res) => res.send('JAD API OK'));

// Middleware de errores
app.use(manejadorErrores);

module.exports = app; // Exporta para server.js
