const { pool } = require('../config/db');
const { crearNomina, obtenerNominas, obtenerNominaPorId, verificarDuplicado } = require('../modelos/nominaModelo');
const { registrarAccion } = require('../modelos/auditoriaModelo');
const { calcularDeducciones, calcularTotalPagado } = require('../utilidades/calculosNomina');

// Generar nómina (POST /api/nominas/generar)
async function generarNomina(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { empleado_id, periodo_inicio, periodo_fin, salario_base } = req.body;

    // Validaciones
    if (!empleado_id || !periodo_inicio || !periodo_fin) {
      return res.status(400).json({ mensaje: 'empleado_id, periodo_inicio y periodo_fin son obligatorios' });
    }

    if (new Date(periodo_inicio) > new Date(periodo_fin)) {
      return res.status(400).json({ mensaje: 'periodo_inicio no puede ser mayor que periodo_fin' });
    }

    if (!salario_base || salario_base <= 0) {
      return res.status(400).json({ mensaje: 'salario_base debe ser mayor que 0' });
    }

    // Verificar si empleado existe
    const [empleados] = await connection.query('SELECT id, nombre_completo FROM empleados WHERE id = ?', [empleado_id]);
    if (empleados.length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    // Verificar duplicado
    const existe = await verificarDuplicado(empleado_id, periodo_inicio, periodo_fin);
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una nómina para este empleado en el mismo periodo' });
    }

    // Calcular deducciones y total
    const deducciones = calcularDeducciones(salario_base);
    const total_pagado = calcularTotalPagado(salario_base, deducciones);

    // Iniciar transacción
    await connection.beginTransaction();

    // Crear nómina
    const nominaId = await crearNomina({
      empleado_id,
      periodo_inicio,
      periodo_fin,
      salario_base,
      deducciones,
      total_pagado
    }, connection);

    // Registrar en auditoría
    await registrarAccion({
      usuario_id: req.usuario.id,
      accion: 'Generó nómina',
      detalle: `Nómina ID ${nominaId} para empleado ${empleados[0].nombre_completo} (${periodo_inicio} - ${periodo_fin})`
    });

    // Commit transacción
    await connection.commit();

    // Obtener la nómina creada
    const nomina = await obtenerNominaPorId(nominaId);

    res.status(201).json({
      mensaje: 'Nómina generada exitosamente',
      nomina
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al generar nómina:', error);
    res.status(500).json({ mensaje: 'Error al generar nómina' });
  } finally {
    connection.release();
  }
}

// Listar nóminas (GET /api/nominas)
async function listarNominas(req, res, next) {
  try {
    const filtros = {};
    if (req.query.empleado_id) filtros.empleado_id = req.query.empleado_id;
    if (req.query.desde) filtros.desde = req.query.desde;
    if (req.query.hasta) filtros.hasta = req.query.hasta;

    const nominas = await obtenerNominas(filtros);
    res.json(nominas);
  } catch (error) {
    console.error('Error al listar nóminas:', error);
    res.status(500).json({ mensaje: 'Error al listar nóminas' });
  }
}

// Obtener nómina por ID (GET /api/nominas/:id)
async function obtenerNomina(req, res, next) {
  try {
    const { id } = req.params;
    const nomina = await obtenerNominaPorId(id);

    if (!nomina) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }

    res.json(nomina);
  } catch (error) {
    console.error('Error al obtener nómina:', error);
    res.status(500).json({ mensaje: 'Error al obtener nómina' });
  }
}

// Eliminar nómina (DELETE /api/nominas/:id) - opcional
async function eliminarNomina(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    // Verificar que existe
    const nomina = await obtenerNominaPorId(id);
    if (!nomina) {
      return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    // Eliminar nómina
    await connection.query('DELETE FROM nominas WHERE id = ?', [id]);

    // Registrar en auditoría
    await registrarAccion({
      usuario_id: req.usuario.id,
      accion: 'Eliminó nómina',
      detalle: `Nómina ID ${id} eliminada`
    });

    await connection.commit();

    res.json({ mensaje: 'Nómina eliminada exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar nómina:', error);
    res.status(500).json({ mensaje: 'Error al eliminar nómina' });
  } finally {
    connection.release();
  }
}

// Listar nóminas del empleado actual (GET /api/nominas/mias)
async function listarMisNominas(req, res, next) {
  try {
    const empleadoId = req.usuario?.empleado_id;
    if (!empleadoId) {
      return res.status(403).json({ mensaje: 'Empleado no identificado' });
    }

    const nominas = await obtenerNominas({ empleado_id: empleadoId });
    res.json(nominas);
  } catch (error) {
    console.error('Error al listar mis nóminas:', error);
    res.status(500).json({ mensaje: 'Error al listar mis nóminas' });
  }
}

module.exports = { generarNomina, listarNominas, obtenerNomina, eliminarNomina, listarMisNominas };
