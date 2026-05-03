
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const controller = require("../controllers/inscripciones.controller");
const validate = require("../middlewares/validate");
const validateId = require("../middlewares/validateId");

const {
    createInscripcionSchema,
    updateInscripcionSchema
} = require("../validators/inscripciones.validator");

router.use(verifyToken);

router.get("/", controller.getInscripciones);

router.get("/:id", validateId, controller.getInscripcion);

router.post("/", validate(createInscripcionSchema), controller.createInscripcion);

router.put("/:id", validateId, validate(updateInscripcionSchema), controller.updateInscripcion);

router.delete("/:id", validateId, controller.deleteInscripcion);

module.exports = router;