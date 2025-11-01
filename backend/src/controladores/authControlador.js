const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    const [rows] = await pool.query('SELECT u.*, e.id as empleado_id FROM usuarios u LEFT JOIN empleados e ON u.id = e.usuario_id WHERE u.correo = ?', [correo]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password_hash).catch(()=>false);
    const valid = match || (password === user.password_hash); // fallback temporal
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, correo: user.correo, role_id: user.role_id, empleado_id: user.empleado_id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, usuario: { id: user.id, correo: user.correo, role_id: user.role_id, empleado_id: user.empleado_id } });
  } catch (err) {
    next(err);
  }
}

async function registrar(req, res, next) {
  try {
    const { correo, password, role_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query('INSERT INTO usuarios (correo, password_hash, role_id) VALUES (?, ?, ?)', [correo, hash, role_id]);
    res.status(201).json({ id: r.insertId, correo });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, registrar };
