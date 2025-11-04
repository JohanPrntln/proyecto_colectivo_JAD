// ==========================
// MODELO DE NÓMINAS
// ==========================
// Se encarga de interactuar con la base de datos MySQL para CRUD de nóminas.

const { pool } = require("../config/db");

// Crear nueva nómina (usando transacción)
async function crearNomina(datos, connection) {
  const { empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones, total_pagado } = datos;
  const [resultado] = await connection.query(
    `INSERT INTO nominas
      (empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones, total_pagado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empleado_id, periodo_inicio, periodo_fin, salario_base, deducciones, total_pagado]
  );
  return resultado.insertId;
}

// Obtener todas las nóminas con filtros opcionales
async function obtenerNominas(filtros = {}) {
  let sql = `
    SELECT n.*, e.nombre_completo, e.area
    FROM nominas n
    LEFT JOIN empleados e ON n.empleado_id = e.id
  `;
  const params = [];

  if (filtros.empleado_id) {
    sql += " WHERE n.empleado_id = ?";
    params.push(filtros.empleado_id);
  }

  if (filtros.desde) {
    sql += filtros.empleado_id ? " AND" : " WHERE";
    sql += " n.periodo_inicio >= ?";
    params.push(filtros.desde);
  }

  if (filtros.hasta) {
    sql += (filtros.empleado_id || filtros.desde) ? " AND" : " WHERE";
    sql += " n.periodo_fin <= ?";
    params.push(filtros.hasta);
  }

  sql += " ORDER BY n.fecha_creacion DESC";

  const [rows] = await pool.query(sql, params);
  return rows;
}

// Obtener nómina por ID
async function obtenerNominaPorId(id) {
  const [rows] = await pool.query(`
    SELECT n.*, e.nombre_completo, e.area
    FROM nominas n
    JOIN empleados e ON n.empleado_id = e.id
    WHERE n.id = ?
  `, [id]);
  return rows[0];
}

// Verificar si existe nómina duplicada
async function verificarDuplicado(empleado_id, periodo_inicio, periodo_fin) {
  const [rows] = await pool.query(
    "SELECT id FROM nominas WHERE empleado_id = ? AND periodo_inicio = ? AND periodo_fin = ?",
    [empleado_id, periodo_inicio, periodo_fin]
  );
  return rows.length > 0;
}

module.exports = {
  crearNomina,
  obtenerNominas,
  obtenerNominaPorId,
  verificarDuplicado,
};
