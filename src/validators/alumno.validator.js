
const { z } = require("zod");

const alumnoSchema = z.object({
    nombre: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Email inválido"),
    telefono: z.string().regex(/^\+?\d{7,15}$/, "Teléfono inválido").optional()
}).strict();

const updateAlumnoSchema = z.object({
    nombre: z.string().min(2).optional(),
    email: z.string().email().optional(),
    telefono: z.string().regex(/^\+?\d{7,15}$/).optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "Debe enviar al menos un campo para actualizar" }
);

module.exports = { alumnoSchema, updateAlumnoSchema };