
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const controller = require("../controllers/pagos.controller");

router.use(verifyToken);

router.get("/", controller.getPagos);
router.get("/resumen", controller.getResumen);
router.post("/", controller.createPago);

module.exports = router;