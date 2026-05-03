
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const controller = require("../controllers/reportes.controller");
const validateId = require("../middlewares/validateId");

router.use(verifyToken);

router.get("/profesores", controller.getGananciasPorProfesor);
router.get("/mensual", controller.getMetricasMensuales);
router.get("/profesores/:id", validateId, controller.getGananciasProfesor);

module.exports = router;