const express = require('express');
const cors = require('cors');

const authRutas = require('./rutas/authRutas');
const empleadoRutas = require('./rutas/empleadoRutas');
const solicitudRutas = require('./rutas/solicitudRutas');
const nominaRutas = require('./rutas/nominaRutas');
const manejadorErrores = require('./middlewares/manejadorErrores');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRutas);
app.use('/api/empleados', empleadoRutas);
app.use('/api/solicitudes', solicitudRutas);
app.use('/api/nominas', nominaRutas);

app.get('/', (req, res) => res.send('JAD API OK'));

app.use(manejadorErrores);

module.exports = app;
