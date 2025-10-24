const { pool } = require('../config/db');

async function listarEmpleados(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT e.*, u.correo FROM empleados e LEFT JOIN usuarios u ON e.usuario_id = u.id');
    res.json(rows);
  } catch (err) { next(err); }
}

async function crearEmpleado(req, res, next) {
  try {
    const { usuario_id, nombre_completo, documento, cargo, area, fecha_ingreso } = req.body;
    const [r] = await pool.query(
      'INSERT INTO empleados (usuario_id, nombre_completo, documento, cargo, area, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id || null, nombre_completo, documento, cargo, area, fecha_ingreso || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) { next(err); }
}

async function obtenerEmpleado(req, res, next) {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT e.*, u.correo FROM empleados e LEFT JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?', [id]);
    res.json(rows[0] || null);
  } catch (err) { next(err); }
}

async function actualizarEmpleado(req, res, next) {
  try {
    const id = req.params.id;
    const { nombre_completo, documento, cargo, area, fecha_ingreso, estado } = req.body;
    await pool.query('UPDATE empleados SET nombre_completo=?, documento=?, cargo=?, area=?, fecha_ingreso=?, estado=? WHERE id=?',
      [nombre_completo, documento, cargo, area, fecha_ingreso, estado, id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { listarEmpleados, crearEmpleado, obtenerEmpleado, actualizarEmpleado };
