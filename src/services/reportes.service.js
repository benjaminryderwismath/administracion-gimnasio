
const pool = require("../config/db");


const getGananciasPorProfesor = async () => {
    const result = await pool.query(`
        SELECT 
            p.id,
            p.nombre,
            SUM(pg.monto) AS total_facturado,
            SUM(pg.comision_profesor) AS total_comision,
            SUM(pg.ganancia_gimnasio) AS ganancia_gimnasio
        FROM pagos pg
        JOIN inscripciones i ON pg.inscripcion_id = i.id
        JOIN profesores p ON i.profesor_id = p.id
        GROUP BY p.id, p.nombre
        ORDER BY total_facturado DESC
    `);

    return result.rows;
};


const getMetricasMensuales = async () => {
    const result = await pool.query(`
        SELECT 
            DATE_TRUNC('month', pg.fecha) AS mes,
            SUM(pg.monto) AS total_facturado,
            SUM(pg.ganancia_gimnasio) AS ganancia_gimnasio
        FROM pagos pg
        GROUP BY mes
        ORDER BY mes DESC
    `);

    return result.rows;
};


const getMetricasPorMes = async (year, month) => {
    const result = await pool.query(`
        SELECT 
        SUM(pg.monto) AS total_facturado,
        SUM(pg.ganancia_gimnasio) AS ganancia_gimnasio
        FROM pagos pg
        WHERE EXTRACT(YEAR FROM pg.fecha) = $1
        AND EXTRACT(MONTH FROM pg.fecha) = $2
    `, [year, month]);

    return result.rows[0];
};


const getGananciasProfesor = async (profesor_id) => {
    const result = await pool.query(`
        SELECT 
            p.nombre,
            SUM(pg.monto) AS total,
            SUM(pg.comision_profesor) AS comision,
            SUM(pg.ganancia_gimnasio) AS ganancia
        FROM pagos pg
        JOIN inscripciones i ON pg.inscripcion_id = i.id
        JOIN profesores p ON i.profesor_id = p.id
        WHERE p.id = $1
        GROUP BY p.nombre
    `, [profesor_id]);

    return result.rows[0];
};

module.exports = {
    getGananciasPorProfesor,
    getMetricasMensuales,
    getMetricasPorMes,
    getGananciasProfesor
};