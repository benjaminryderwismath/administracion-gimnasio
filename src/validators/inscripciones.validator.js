
const { z } = require("zod");

const createInscripcionSchema  = z.object({
    alumno_id: z.number().int().positive(),
    profesor_id: z.number().int().positive().nullable().optional(),
    tipo: z.enum(["mensual", "trimestral", "semestral", "anual"])
});

const updateInscripcionSchema = z.object({
    tipo: z.enum(["mensual", "trimestral", "semestral", "anual"])
});

module.exports = {
    createInscripcionSchema ,
    updateInscripcionSchema
};
