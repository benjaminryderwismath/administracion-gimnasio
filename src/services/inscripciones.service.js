
const pool = require("../config/db");

const calcularVencimiento = (tipo, inicio) => {
    const fecha = new Date(inicio);

    const reglas = {
        mensual: 1,
        trimestral: 3,
        semestral: 6,
        anual: 12
    };

    fecha.setMonth(fecha.getMonth() + reglas[tipo]);
    fecha.setHours(0, 0, 0, 0);
    
    return fecha;
};


const getInscripcionById = async (id) => {
    const result = await pool.query(
        `SELECT 
        i.id,
        i.tipo,
        i.estado,
        i.inicio,
        i.vencimiento,
        a.nombre AS alumno,
        a.email,
        a.telefono,
        p.nombre AS profesor
        FROM inscripciones i
        JOIN alumnos a ON i.alumno_id = a.id
        LEFT JOIN profesores p ON i.profesor_id = p.id
        WHERE i.id = $1`,
        [id]
    );

    return result.rows[0];
};


const getInscripciones = async () => {

    await pool.query(`
        UPDATE inscripciones
        SET estado = 'vencido'
        WHERE vencimiento < CURRENT_DATE
        AND estado = 'activo'
    `);

    const result = await pool.query(
        `SELECT 
        i.id,
        i.tipo,
        i.estado,
        i.inicio,
        i.vencimiento,
        a.nombre AS alumno,
        p.nombre AS profesor
        FROM inscripciones i
        JOIN alumnos a ON i.alumno_id = a.id
        LEFT JOIN profesores p ON i.profesor_id = p.id
        ORDER BY i.id DESC`
    );

    return result.rows;
};


const createInscripcion = async ({ alumno_id, profesor_id, tipo }) => {


    await pool.query(`
        UPDATE inscripciones
        SET estado = 'vencido'
        WHERE vencimiento < CURRENT_DATE
        AND estado = 'activo'
    `);

    
    const existe = await pool.query(
        `SELECT 1 FROM inscripciones 
        WHERE alumno_id = $1 AND estado = 'activo'`,
        [alumno_id]
    );

    if (existe.rows.length > 0) {
        throw new Error("El alumno ya tiene una inscripción activa");
    }


    const inicio = new Date();
    const vencimiento = calcularVencimiento(tipo, inicio);

    const result = await pool.query(
        `INSERT INTO inscripciones 
        (alumno_id, profesor_id, tipo, inicio, vencimiento)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [alumno_id, profesor_id, tipo, inicio, vencimiento]
    );

    return result.rows[0];
};


const updateInscripcion = async (id, { tipo, profesor_id }) => {

    const actual = await getInscripcionById(id);
    if (!actual) return null;

    let inicio = actual.inicio;
    let vencimiento = actual.vencimiento;

    
    if (tipo && tipo !== actual.tipo) {
        inicio = new Date();
        vencimiento = calcularVencimiento(tipo, inicio);
    }

    const result = await pool.query(
        `UPDATE inscripciones
        SET tipo = COALESCE($1, tipo),
            profesor_id = COALESCE($2, profesor_id),
            inicio = $3,
            vencimiento = $4
        WHERE id = $5
        RETURNING *`,
        [tipo, profesor_id, inicio, vencimiento, id]
    );

    return result.rows[0];
};


const deleteInscripcion = async (id) => {
    await pool.query(
        `UPDATE inscripciones
        SET estado = 'cancelado'
        WHERE id = $1`,
        [id]
    );

    return { message: "Inscripción cancelada" };
};

module.exports = {
    getInscripciones,
    getInscripcionById,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion
};