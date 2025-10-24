const express = require('express');
const router = express.Router();
const { login, registrar } = require('../controladores/authControlador');

router.post('/login', login);
router.post('/register', registrar);

module.exports = router;
