// test_db.js
import { pool } from './db.js';

async function testConnection() {
  try {
    // Probar conexión
    const [rows] = await pool.query('SELECT NOW() AS hora_actual');
    console.log('✅ Conectado a MySQL correctamente.');
    console.log('Hora del servidor MySQL:', rows[0].hora_actual);

    // Leer roles para comprobar acceso
    const [roles] = await pool.query('SELECT * FROM roles');
    console.log('Tabla roles:', roles);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testConnection();
