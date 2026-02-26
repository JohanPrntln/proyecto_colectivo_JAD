const express = require("express");
const router = express.Router();
const ctrl = require("../controladores/solicitudControlador");
const autenticar = require("../middlewares/autenticar");
const { esAdmin, esJefe } = require("../middlewares/roles");

// Rutas protegidas
router.get("/", autenticar, esJefe, ctrl.listarSolicitudes);
router.get("/mias", autenticar, ctrl.listarSolicitudesEmpleado);
router.post("/", autenticar, ctrl.crearSolicitud);
router.put("/:id", autenticar, esJefe, ctrl.actualizarEstado);

module.exports = router;

