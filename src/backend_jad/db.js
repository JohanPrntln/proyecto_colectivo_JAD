// db.js
import mysql from 'mysql2/promise';

// ⚠️ Usa los mismos datos que en tu Workbench
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1123160657', // la misma del Workbench
  database: 'jad_mvp',
  port: 3306 // el puerto por defecto, si no lo cambiaste
});
