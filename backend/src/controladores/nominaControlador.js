const { pool } = require('../config/db');

async function crearNomina(req, res, next) {
  try {
    const { empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones } = req.body;
    const total = Number(salario_base) - Number(deducciones || 0);
    const [r] = await pool.query('INSERT INTO nominas (empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones, total_pagado) VALUES (?, ?, ?, ?, ?, ?)',
      [empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones || 0, total]);
    res.status(201).json({ id: r.insertId, total_pagado: total });
  } catch (err) { next(err); }
}

async function listarNominas(req, res, next) {
  try {
    if (req.usuario.role_id === 3) {
      const [emps] = await pool.query('SELECT id FROM empleados WHERE usuario_id = ?', [req.usuario.id]);
      if (!emps.length) return res.json([]);
      const empleado_id = emps[0].id;
      const [rows] = await pool.query('SELECT * FROM nominas WHERE empleado_id = ? ORDER BY fecha_creacion DESC', [empleado_id]);
      return res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT n.*, e.nombre_completo FROM nominas n JOIN empleados e ON n.empleado_id = e.id ORDER BY n.fecha_creacion DESC');
      return res.json(rows);
    }
  } catch (err) { next(err); }
}

module.exports = { crearNomina, listarNominas };
