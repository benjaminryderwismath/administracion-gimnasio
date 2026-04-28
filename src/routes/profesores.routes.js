

const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");

const {
    getProfesor,
    getProfesores,
    createProfesor,
    updateProfesor,
    deleteProfesor
} = require("../controllers/profesores.controller");
const { profesorSchema } = require("../validators/profesores.validator");

router.use(verifyToken);

router.get("/", getProfesores);

router.get("/:id", getProfesor);

router.post("/", validateSchema (profesorSchema), createProfesor);

router.put("/:id",updateProfesor);

router.delete("/:id", deleteProfesor);

module.exports = router;