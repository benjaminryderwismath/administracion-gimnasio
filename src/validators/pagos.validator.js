const { z } = require("zod");

const createPagoSchema = z.object({
    inscripcion_id: z.number().int().positive("inscripcion_id debe ser un entero positivo"),
    monto: z.number().positive("El monto debe ser mayor a 0"),
    metodo_pago: z.enum(["efectivo", "transferencia", "tarjeta"], {
        errorMap: () => ({ message: "metodo_pago inválido" })
    }).optional()
});

module.exports = { createPagoSchema };
