

const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");

const {
    getAlumno,
    getAlumnos,
    createAlumno,
    updateAlumno,
    deleteAlumno
} = require("../controllers/alumno.controller");
const { alumnoSchema, updateAlumnoSchema } = require("../validators/alumno.validator");
const validateId = require("../middlewares/validateId");

router.use(verifyToken);

router.get("/", getAlumnos);

router.get("/:id", validateId, getAlumno);

router.post("/", validateSchema(alumnoSchema), createAlumno);

router.put("/:id", validateId, validateSchema(updateAlumnoSchema), updateAlumno);

router.delete("/:id", validateId, deleteAlumno);

module.exports = router;