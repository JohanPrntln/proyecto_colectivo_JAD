const { pool } = require('./src/config/db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT id, correo, password_hash FROM usuarios WHERE correo = "admin@jad.com"');
    console.log('Usuario admin:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
