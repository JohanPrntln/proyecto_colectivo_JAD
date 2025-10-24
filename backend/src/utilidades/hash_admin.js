const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    const nuevoPassword = 'admin123';
    const hash = await bcrypt.hash(nuevoPassword, 10);
    const [res] = await connection.execute('UPDATE usuarios SET password_hash = ? WHERE correo = ?', [hash, 'admin@jad.com']);
    console.log('Filas afectadas:', res.affectedRows);
    await connection.end();
    console.log('Contraseña admin hasheada.');
  } catch (err) {
    console.error(err);
  }
})();
