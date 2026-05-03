
const inscripcionesService = require("../services/inscripciones.service");
const AppError = require("../utils/AppError");


const getInscripciones = async (req, res, next) => {
    try {
        const inscripciones = await inscripcionesService.getInscripciones();
        res.json(inscripciones);
    } catch (error) {
        next(error);
    }
};


const getInscripcion = async (req, res, next) => {
    try {
        const inscripcion = await inscripcionesService.getInscripcionById(
            req.params.id
        );

        if (!inscripcion) {
            throw new AppError("Inscripción no encontrada", 404);
        }

        res.json(inscripcion);
    } catch (error) {
        next(error);
    }
};


const createInscripcion = async (req, res, next) => {
    try {
        const nueva = await inscripcionesService.createInscripcion(req.body);

        res.status(201).json({
            message: "Inscripción creada",
            data: nueva
        });
    } catch (error) {
        next(error);
    }
};


const updateInscripcion = async (req, res, next) => {
    try {
        const actualizada = await inscripcionesService.updateInscripcion(
            req.params.id,
            req.body
        );

        if (!actualizada) {
            throw new AppError("Inscripción no encontrada", 404);
        }

        res.json(actualizada);
    } catch (error) {
        next(error);
    }
};


const deleteInscripcion = async (req, res, next) => {
    try {
        await inscripcionesService.deleteInscripcion(req.params.id);

        res.json({ message: "Inscripción eliminada" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInscripciones,
    getInscripcion,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion
};