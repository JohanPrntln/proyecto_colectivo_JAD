const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const { listarEmpleados, crearEmpleado, obtenerEmpleado, actualizarEmpleado } = require('../controladores/empleadoControlador');

router.get('/', autenticar, listarEmpleados);
router.post('/', autenticar, crearEmpleado);
router.get('/:id', autenticar, obtenerEmpleado);
router.put('/:id', autenticar, actualizarEmpleado);

module.exports = router;
