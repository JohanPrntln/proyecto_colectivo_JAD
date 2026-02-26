// hash_admin.js - Script para hashear la contraseña del admin
// Este script se ejecuta una vez para actualizar la contraseña del usuario admin.
// Hashea 'admin123' y actualiza la BD. No se usa en producción, solo para setup inicial.

const mysql = require('mysql2/promise'); // Librería para conexión MySQL
const bcrypt = require('bcryptjs'); // Librería para hashear contraseñas
require('dotenv').config(); // Carga variables de entorno

(async () => {
  try {
    // Conecta a la BD usando variables de entorno
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const nuevoPassword = 'admin123'; // Nueva contraseña en texto plano
    const hash = await bcrypt.hash(nuevoPassword, 10); // Hashea con salt rounds 10

    // Actualiza la contraseña en la BD para el admin
    const [res] = await connection.execute('UPDATE usuarios SET password = ? WHERE correo = ?', [hash, 'admin@jad.com']);
    console.log('Filas afectadas:', res.affectedRows);

    await connection.end(); // Cierra la conexión
    console.log('Contraseña admin hasheada y actualizada en BD.');
  } catch (err) {
    console.error('Error al hashear contraseña:', err);
  }
})(); // Ejecuta automáticamente al importar el archivo
