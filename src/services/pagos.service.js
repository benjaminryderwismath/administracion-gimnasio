
const pool = require("../config/db");

const parsePago = (pago) => ({
    ...pago,
    monto: Number(pago.monto),
    comision_profesor: Number(pago.comision_profesor),
    ganancia_gimnasio: Number(pago.ganancia_gimnasio)
});

const calcularVencimiento = (tipo, inicio) => {
    const fecha = new Date(inicio);

    const reglas = {
        mensual: 1,
        trimestral: 3,
        semestral: 6,
        anual: 12
    };

    fecha.setMonth(fecha.getMonth() + reglas[tipo]);
    return fecha;
};

const createPago = async ({ inscripcion_id, monto, metodo_pago }) => {

    if (!inscripcion_id || !monto) {
        throw new Error("Datos incompletos");
    }

    const inscripcionRes = await pool.query(
        `SELECT 
            i.id, 
            i.tipo,
            i.profesor_id,
            i.vencimiento,
            p.comision
        FROM inscripciones i
        LEFT JOIN profesores p ON i.profesor_id = p.id
        WHERE i.id = $1`,
        [inscripcion_id]
    );

    const inscripcion = inscripcionRes.rows[0];

    if (!inscripcion) {
        throw new Error("Inscripción no encontrada");
    }

    const porcentaje = Number(inscripcion.comision) || 0;

    const comision_profesor = (monto * porcentaje) / 100;
    const ganancia_gimnasio = monto - comision_profesor;

    const result = await pool.query(
        `INSERT INTO pagos 
        (inscripcion_id, monto, metodo_pago, comision_profesor, ganancia_gimnasio)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [inscripcion_id, monto, metodo_pago, comision_profesor, ganancia_gimnasio]
    );

    const pago = result.rows[0];


    const hoy = new Date();
    const vencimientoActual = new Date(inscripcion.vencimiento);

    const baseDate =
        vencimientoActual > hoy
            ? vencimientoActual
            : hoy;

    const nuevoVencimiento = calcularVencimiento(
        inscripcion.tipo,
        baseDate
    );

    await pool.query(
        `UPDATE inscripciones
        SET 
            inicio = $1,
            vencimiento = $2,
            estado = 'activo',
            notificado = false
        WHERE id = $3`,
        [hoy, nuevoVencimiento, inscripcion_id]
    );

    return parsePago(pago);
};

const getPagos = async () => {
    const result = await pool.query(
        `SELECT 
            p.id,
            p.monto,
            p.metodo_pago,
            p.fecha,
            p.comision_profesor,
            p.ganancia_gimnasio,
            a.nombre AS alumno,
            pr.nombre AS profesor
        FROM pagos p
        JOIN inscripciones i ON p.inscripcion_id = i.id
        JOIN alumnos a ON i.alumno_id = a.id
        LEFT JOIN profesores pr ON i.profesor_id = pr.id
        ORDER BY p.fecha DESC`
    );

    return result.rows.map(parsePago);
};

const getResumen = async () => {
    const result = await pool.query(
        `SELECT 
            COALESCE(SUM(monto),0) as total_ingresos,
            COALESCE(SUM(comision_profesor),0) as total_profesores,
            COALESCE(SUM(ganancia_gimnasio),0) as total_gimnasio
        FROM pagos`
    );

    const r = result.rows[0];

    return {
        total_ingresos: Number(r.total_ingresos),
        total_profesores: Number(r.total_profesores),
        total_gimnasio: Number(r.total_gimnasio)
    };
};

module.exports = {
    createPago,
    getPagos,
    getResumen
};