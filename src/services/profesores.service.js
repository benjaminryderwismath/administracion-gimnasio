
const pool = require("../config/db");

const getProfesores = async () => {
    const result = await pool.query("SELECT * FROM profesores");
    return result.rows;
};

const getProfesor = async (id) => {
    const result = await pool.query(
        "SELECT * FROM profesores WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

const createProfesor = async (data) => {
    const { nombre, comision } = data;
    const result = await pool.query(
        "INSERT INTO profesores (nombre, comision) VALUES ($1, $2) RETURNING *",
        [nombre, comision]
    );
    return result.rows[0];
};

const updateProfesor = async (id, data) => {
    const { nombre, comision } = data;
    const result = await pool.query(
        "UPDATE profesores SET nombre = $1, comision = $2 WHERE id = $3 RETURNING *",
        [nombre, comision, id]
    );
    return result.rows[0];
};

const deleteProfesor = async (id) => {
    const result = await pool.query(
        "DELETE FROM profesores WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

module.exports = { getProfesores, getProfesor, createProfesor, updateProfesor, deleteProfesor };