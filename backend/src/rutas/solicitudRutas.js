const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const { crearSolicitud, listarSolicitudes, revisarSolicitud } = require('../controladores/solicitudControlador');

router.post('/', autenticar, crearSolicitud);
router.get('/', autenticar, listarSolicitudes);
router.post('/:id/revisar', autenticar, revisarSolicitud);

module.exports = router;
