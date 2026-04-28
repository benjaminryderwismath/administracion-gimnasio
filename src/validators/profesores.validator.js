
const { z } = require("zod");

const profesorSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    comision: z.coerce.number().min(0).max(100)
}).strict()

const updateSchema = z.object({
    nombre: z.string().optional(),
    comision: z.coerce.number().min(0).max(100).optional()
}).strict().refine(
(data) => Object.keys(data).length > 0,
{ message:"Debe enviar al menos un campo para actualizar" }
);


module.exports = { profesorSchema, updateSchema };


