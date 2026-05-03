
const pool = require("../config/db");
const { enviarRecordatorio } = require("./notificaciones.service");

const enviarRecordatorios = async () => {
    const result = await pool.query(`
        SELECT 
            i.id,
            a.nombre,
            a.email,
            a.telefono,
            i.vencimiento
        FROM inscripciones i
        JOIN alumnos a ON i.alumno_id = a.id
        WHERE i.estado = 'activo'
        AND i.vencimiento = CURRENT_DATE + INTERVAL '5 days'
        AND i.notificado = false
    `);

    for (const alumno of result.rows) {
        await enviarRecordatorio(alumno);

        await pool.query(
            `UPDATE inscripciones 
            SET notificado = true 
            WHERE id = $1`,
            [alumno.id]
        );
    }

    console.log(`📢 Recordatorios enviados: ${result.rows.length}`);
};

module.exports = { enviarRecordatorios };