const { pool } = require('../config/db');

async function crearSolicitud(req, res, next) {
  try {
    const usuarioId = req.usuario.id;
    const [emps] = await pool.query('SELECT id FROM empleados WHERE usuario_id = ?', [usuarioId]);
    if (!emps.length) return res.status(400).json({ error: 'Empleado no encontrado' });
    const empleado_id = emps[0].id;
    const { tipo, fecha_inicio, fecha_fin, dias_solicitados, motivo, soporte } = req.body;
    const [r] = await pool.query(
      'INSERT INTO solicitudes (empleado_id, tipo, fecha_inicio, fecha_fin, dias_solicitados, motivo, soporte) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [empleado_id, tipo, fecha_inicio, fecha_fin, dias_solicitados || null, motivo || null, soporte || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) { next(err); }
}

async function listarSolicitudes(req, res, next) {
  try {
    if (req.usuario.role_id === 3) {
      const [emps] = await pool.query('SELECT id FROM empleados WHERE usuario_id = ?', [req.usuario.id]);
      if (!emps.length) return res.json([]);
      const empleado_id = emps[0].id;
      const [rows] = await pool.query('SELECT * FROM solicitudes WHERE empleado_id = ? ORDER BY fecha_creacion DESC', [empleado_id]);
      return res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT s.*, e.nombre_completo FROM solicitudes s JOIN empleados e ON s.empleado_id = e.id ORDER BY s.fecha_creacion DESC');
      return res.json(rows);
    }
  } catch (err) { next(err); }
}

async function revisarSolicitud(req, res, next) {
  try {
    const id = req.params.id;
    const { accion } = req.body; // 'aprobar'|'rechazar'
    if (!['aprobar','rechazar'].includes(accion)) return res.status(400).json({ error: 'Acción inválida' });
    const estado = accion === 'aprobar' ? 'aprobado' : 'rechazado';
    await pool.query('UPDATE solicitudes SET estado = ?, revisado_por = ?, fecha_revision = NOW() WHERE id = ?', [estado, req.usuario.id, id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { crearSolicitud, listarSolicitudes, revisarSolicitud };
