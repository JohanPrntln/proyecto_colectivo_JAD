const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/autenticar');
const { crearNomina, listarNominas } = require('../controladores/nominaControlador');

router.post('/', autenticar, crearNomina);
router.get('/', autenticar, listarNominas);

module.exports = router;
