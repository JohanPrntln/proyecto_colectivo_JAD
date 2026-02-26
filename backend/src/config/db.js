// db.js - Configuración de la conexión a la base de datos MySQL
// Configura un pool de conexiones MySQL usando mysql2/promise para reutilización.

const mysql = require('mysql2/promise'); // Librería para MySQL con promesas
require('dotenv').config(); // Carga variables de entorno

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Host de la BD
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // Puerto
  user: process.env.DB_USER || 'root', // Usuario
  password: process.env.DB_PASS || '', // Contraseña
  database: process.env.DB_NAME || 'jad_mvp', // Nombre de la BD
  waitForConnections: true, // Espera conexiones si lleno
  connectionLimit: 10 // Máximo 10 conexiones
});

module.exports = { pool }; // Exporta el pool para modelos y controladores
