

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
const { alumnoSchema } = require("../validators/alumno.validator");

router.use(verifyToken);

router.get("/", getAlumnos);

router.get("/:id", getAlumno);

router.post("/", validateSchema (alumnoSchema), createAlumno);

router.put("/:id",updateAlumno);

router.delete("/:id", deleteAlumno);

module.exports = router;