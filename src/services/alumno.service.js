
const pool = require("../config/db");


const getAlumno = async(id) => {
    const result = await pool.query(
        "SELECT * FROM alumnos WHERE id = $1",
        [id]
    );
    return result.rows[0];
};


const getAlumnos = async() => {
    const result = await pool.query("SELECT * FROM alumnos");
    return result.rows;
};

const createAlumno = async(data) => {
    const { nombre, email, telefono } = data;

    const result = await pool.query(
        `insert into alumnos ( nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *`,
        [nombre, email, telefono]
    );

    return result.rows[0];
};



const updateAlumno = async(id, data) => {
    const { nombre, email, telefono } = data;

    const result = await pool.query(
        `UPDATE alumnos SET nombre = $1, email = $2, telefono = $3 WHERE id = $4 RETURNING *`,
        [nombre, email, telefono, id]
    );

    return result.rows[0];
};


const deleteAlumno = async(id) => {
    
    const result = await pool.query(
        `DELETE FROM alumnos WHERE id =$1 RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = { getAlumno, getAlumnos, createAlumno, updateAlumno, deleteAlumno };