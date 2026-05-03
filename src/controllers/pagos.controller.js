
const pagosService = require("../services/pagos.service");

const createPago = async (req, res, next) => {
    try {
        const pago = await pagosService.createPago(req.body);

        res.status(201).json({
            message: "Pago registrado",
            data: pago
        });
    } catch (error) {
        next(error);
    }
};

const getPagos = async (req, res, next) => {
    try {
        const pagos = await pagosService.getPagos();
        res.json(pagos);
    } catch (error) {
        next(error);
    }
};

const getResumen = async (req, res, next) => {
    try {
        const resumen = await pagosService.getResumen();
        res.json(resumen);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPago,
    getPagos,
    getResumen
};