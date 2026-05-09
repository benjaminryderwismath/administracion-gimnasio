
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const controller = require("../controllers/pagos.controller");
const { createPagoSchema } = require("../validators/pagos.validator");

router.use(verifyToken);

router.get("/", controller.getPagos);
router.get("/resumen", controller.getResumen);
router.post("/", validate(createPagoSchema), controller.createPago);

module.exports = router;