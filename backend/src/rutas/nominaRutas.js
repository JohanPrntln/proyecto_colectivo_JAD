const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const { esAdmin, esJefe } = require('../middlewares/roles');
const { generarNomina, listarNominas, obtenerNomina, eliminarNomina, listarMisNominas } = require('../controladores/nominaControlador');

// Generar nómina - solo admin o jefe
router.post('/generar', autenticar, esJefe, generarNomina);

// Listar nóminas - todos autenticados
router.get('/', autenticar, listarNominas);

// Listar nóminas del empleado actual
router.get('/mias', autenticar, listarMisNominas);

// Obtener nómina por ID - todos autenticados
router.get('/:id', autenticar, obtenerNomina);

// Eliminar nómina - solo admin o jefe (opcional)
router.delete('/:id', autenticar, esJefe, eliminarNomina);

module.exports = router;
