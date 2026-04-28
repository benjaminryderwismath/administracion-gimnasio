
const profesoresservice = require("../services/profesores.service");
const AppError = require("../utils/AppError");

const getProfesor = async(req, res, next) => {
    try{
        const profesores = await profesoresservice.getProfesor(
            req.params.id
        );
        res.json(profesores)
    } catch (error) {
        next (error);
    }
};


const getProfesores = async(req, res, next) => {
    try {
        const profesores = await profesoresservice.getProfesores();
        res.json(profesores);
    } catch (error) {
        next(error);
    }
};


const createProfesor = async(req, res, next) => {
    try{
        const profesores = await profesoresservice.createProfesor(
            req.body
        );
        res.status(201).json({
            message:"Profesor creado", 
            profesores
        });
    } catch (error) {
        next (error);
    }
};


const updateProfesor = async(req, res, next) => {
    try{
        const profesores = await profesoresservice.updateProfesor(
        req.params.id,
        req.body
    );
    res.json(profesores);
    } catch (error) {
        next(error);
    }
};


const deleteProfesor = async(req, res, next) => {
    try{
        const profesores = await profesoresservice.deleteProfesor(
            req.params.id
        );
        if (!profesores) {
            throw new AppError("Profesor no encontrado", 404)
        }
        res.json({
            message:"Profesor eliminado"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { getProfesor, getProfesores, createProfesor, updateProfesor, deleteProfesor };