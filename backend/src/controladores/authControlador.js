// authControlador.js - Controlador para autenticación (login y registro)
// Maneja las operaciones de login y registro de usuarios, generando tokens JWT.

const { pool } = require('../config/db'); // Pool de conexiones MySQL
const bcrypt = require('bcryptjs'); // Librería para hashear/verificar contraseñas
const jwt = require('jsonwebtoken'); // Librería para generar tokens JWT

// Función para login de usuario
async function login(req, res, next) {
  try {
    const { correo, password } = req.body; // Extrae correo y password del body

    // Busca usuario por correo con JOIN a empleados para obtener empleado_id
    const [rows] = await pool.query('SELECT u.*, e.id as empleado_id FROM usuarios u LEFT JOIN empleados e ON u.id = e.usuario_id WHERE u.correo = ?', [correo]);
    const user = rows[0];

    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' }); // Usuario no encontrado

    // Verifica contraseña (hasheada o fallback temporal para migración)
    const match = await bcrypt.compare(password, user.password_hash).catch(() => false);
    const valid = match || (password === user.password_hash); // Fallback temporal
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Genera token JWT con payload del usuario, expira en 8 horas
    const token = jwt.sign({ id: user.id, correo: user.correo, role_id: user.role_id, empleado_id: user.empleado_id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Responde con token y datos del usuario
    res.json({ token, usuario: { id: user.id, correo: user.correo, role_id: user.role_id, empleado_id: user.empleado_id } });
  } catch (err) {
    next(err); // Pasa errores al manejador global
  }
}

// Función para registrar nuevo usuario
async function registrar(req, res, next) {
  try {
    const { correo, password, role_id } = req.body; // Extrae datos del body

    const hash = await bcrypt.hash(password, 10); // Hashea la contraseña

    // Inserta nuevo usuario en BD
    const [r] = await pool.query('INSERT INTO usuarios (correo, password_hash, role_id) VALUES (?, ?, ?)', [correo, hash, role_id]);

    // Responde con ID y correo del nuevo usuario
    res.status(201).json({ id: r.insertId, correo });
  } catch (err) {
    next(err); // Pasa errores al manejador global
  }
}

module.exports = { login, registrar }; // Exporta las funciones para usar en rutas
