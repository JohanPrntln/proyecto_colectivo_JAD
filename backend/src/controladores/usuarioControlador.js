// =======================================
// CONTROLADOR: usuarioControlador.js
// =======================================
// Este archivo maneja la creación de usuarios y empleados al mismo tiempo.
// Solo los administradores autenticados pueden hacerlo.
// Se usa bcrypt para hashear la contraseña y una transacción MySQL para
// asegurar que los dos registros se creen correctamente (usuario y empleado).

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Controlador principal
async function crearUsuarioYEmpleado(req, res) {
  console.log('📩 Petición recibida para crear usuario + empleado');
  console.log('BODY:', req.body);

  // Extraemos los datos del body (formulario)
  const {
    correo,
    contrasena,
    role_id,
    activo = true,
    nombre_completo,
    documento,
    cargo = null,
    area = null,
    fecha_ingreso = null,
    estado = 'activo'
  } = req.body;

  // Validamos que los campos obligatorios estén presentes
  if (!correo || !contrasena || !role_id || !nombre_completo || !documento) {
    return res.status(400).json({
      mensaje: 'Faltan datos requeridos (correo, contrasena, role_id, nombre_completo, documento)',
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ mensaje: 'Correo electrónico inválido' });
  }

  // Obtenemos conexión de la pool (para transacción)
  const conn = await pool.getConnection();
  try {
    // 🔎 1) Verificar que el correo no exista
    const [exCorreo] = await conn.query('SELECT id FROM usuarios WHERE correo = ? LIMIT 1', [correo]);
    if (exCorreo.length > 0) {
      conn.release();
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    // 🔎 2) Verificar que el documento no exista
    const [exDoc] = await conn.query('SELECT id FROM empleados WHERE documento = ? LIMIT 1', [documento]);
    if (exDoc.length > 0) {
      conn.release();
      return res.status(409).json({ mensaje: 'El documento ya está registrado' });
    }

    // 🔒 3) Hashear la contraseña una sola vez
    const password_hash = await bcrypt.hash(contrasena, 10);

    // 💾 4) Iniciamos la transacción
    await conn.beginTransaction();

    // 🧍‍♂️ 5) Insertamos en la tabla usuarios
    const [resUser] = await conn.query(
      'INSERT INTO usuarios (correo, password_hash, role_id, activo) VALUES (?, ?, ?, ?)',
      [correo, password_hash, role_id, activo ? 1 : 0]
    );
    const usuarioId = resUser.insertId;

    // 👨‍💼 6) Insertamos en la tabla empleados
    const [resEmp] = await conn.query(
      `INSERT INTO empleados (usuario_id, nombre_completo, documento, cargo, area, fecha_ingreso, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [usuarioId, nombre_completo, documento, cargo, area, fecha_ingreso, estado]
    );
    const empleadoId = resEmp.insertId;

    // 🧾 7) Insertamos en la tabla auditoría
    const detalle = JSON.stringify({ correo, documento, creado_por: req.usuario?.id || null });
    await conn.query(
      'INSERT INTO auditoria (usuario_id, accion, detalle) VALUES (?, ?, ?)',
      [req.usuario?.id || null, 'crear_usuario', detalle]
    );

    // ✅ 8) Confirmamos la transacción
    await conn.commit();
    conn.release();

    // 🔔 Respuesta de éxito
    return res.status(201).json({
      mensaje: 'Usuario y empleado creados correctamente',
      usuario_id: usuarioId,
      empleado_id: empleadoId,
    });
  } catch (error) {
    // ❌ Si algo falla, revertimos cambios
    try { await conn.rollback(); } catch {}
    conn.release();
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ mensaje: 'Error al crear usuario y empleado', detalle: error.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const [rows] = await pool.query('SELECT u.id, u.correo, u.role_id, u.activo, e.nombre_completo, e.documento, e.cargo, e.area, e.estado, CASE WHEN u.role_id = 1 THEN \'Administrador\' WHEN u.role_id = 2 THEN \'RRHH\' WHEN u.role_id = 3 THEN \'Empleado\' ELSE \'Desconocido\' END as rol FROM usuarios u LEFT JOIN empleados e ON u.id = e.usuario_id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
}


module.exports = { crearUsuarioYEmpleado, listarUsuarios };
