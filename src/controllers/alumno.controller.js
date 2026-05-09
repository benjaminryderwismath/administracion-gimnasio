

const alumnoservice = require("../services/alumno.service");
const AppError = require("../utils/AppError");

const getAlumno = async(req, res, next) => {
    try{
        const alumno = await alumnoservice.getAlumno(
            req.params.id
        );
        if (!alumno) {
            throw new AppError("Alumno no encontrado", 404);
        }
        res.json(alumno);
    } catch (error) {
        next (error);
    }
};


const getAlumnos = async(req, res, next) => {
    try {
        const alumnos = await alumnoservice.getAlumnos();
        res.json(alumnos);
    } catch (error) {
        next(error);
    }
};


const createAlumno = async(req, res, next) => {
    try{
        const alumnos = await alumnoservice.createAlumno(
            req.body
        );
        res.status(201).json({
            message:"Alumno creado", 
            alumnos
        });
    } catch (error) {
        next (error);
    }
};


const updateAlumno = async(req, res, next) => {
    try{
        const alumnos = await alumnoservice.updateAlumno(
        req.params.id,
        req.body
    );
    res.json(alumnos);
    } catch (error) {
        next(error);
    }
};


const deleteAlumno = async(req, res, next) => {
    try{
        const alumnos = await alumnoservice.deleteAlumno(
            req.params.id
        );
        if (!alumnos) {
            throw new AppError("Alumno no encontrado", 404)
        }
        res.json({
            message:"Alumno eliminado"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { getAlumno, getAlumnos, createAlumno, updateAlumno, deleteAlumno };