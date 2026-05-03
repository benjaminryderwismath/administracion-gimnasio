
const reportesService = require("../services/reportes.service");

const getGananciasPorProfesor = async (req, res, next) => {
    try {
        const data = await reportesService.getGananciasPorProfesor();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getMetricasMensuales = async (req, res, next) => {
    try {
        const { year, month } = req.query;

        if (year && month) {
            const data = await reportesService.getMetricasPorMes(year, month);
            return res.json(data);
        }

        const data = await reportesService.getMetricasMensuales();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getGananciasProfesor = async (req, res, next) => {
    try {
        const data = await reportesService.getGananciasProfesor(req.params.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGananciasPorProfesor,
    getMetricasMensuales,
    getGananciasProfesor
};