
process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");
const jwt = require("jsonwebtoken");

jest.mock("../src/config/db", () => ({
    query: jest.fn()
}));

jest.mock("../src/jobs/cron.js", () => {});

const token = jwt.sign(
    { id: 1, email: "benji@gym.com" },
    "test_secret",
    { expiresIn: "1h" }
);

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("GET /alumnos", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna lista de alumnos", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Juan", email: "juan@gym.com" }]
        });

        const res = await request(app).get("/alumnos").set(auth());

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].nombre).toBe("Juan");
    });

    test("falla sin token", async () => {
        const res = await request(app).get("/alumnos");
        expect(res.status).toBe(401);
    });
});

describe("GET /alumnos/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna un alumno por ID", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Juan", email: "juan@gym.com" }]
        });

        const res = await request(app).get("/alumnos/1").set(auth());

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe("Juan");
    });

    test("retorna 404 si el alumno no existe", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/alumnos/999").set(auth());

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Alumno no encontrado");
    });

    test("retorna 400 con ID inválido", async () => {
        const res = await request(app).get("/alumnos/abc").set(auth());
        expect(res.status).toBe(400);
    });
});

describe("POST /alumnos", () => {
    beforeEach(() => jest.clearAllMocks());

    test("crea un alumno con datos válidos", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 2, nombre: "Maria", email: "maria@gym.com", telefono: "+5491112345678" }]
        });

        const res = await request(app).post("/alumnos").set(auth()).send({
            nombre: "Maria",
            email: "maria@gym.com",
            telefono: "+5491112345678"
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Alumno creado");
    });

    test("falla con email inválido", async () => {
        const res = await request(app).post("/alumnos").set(auth()).send({
            nombre: "Maria",
            email: "no-es-un-email"
        });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
    });

    test("falla con nombre muy corto", async () => {
        const res = await request(app).post("/alumnos").set(auth()).send({
            nombre: "A",
            email: "maria@gym.com"
        });

        expect(res.status).toBe(400);
    });

    test("falla con campos extra (strict mode)", async () => {
        const res = await request(app).post("/alumnos").set(auth()).send({
            nombre: "Maria",
            email: "maria@gym.com",
            campo_raro: "hack"
        });

        expect(res.status).toBe(400);
    });
});

describe("PUT /alumnos/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("actualiza un alumno correctamente", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Juan Updated", email: "juan@gym.com" }]
        });

        const res = await request(app).put("/alumnos/1").set(auth()).send({
            nombre: "Juan Updated"
        });

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe("Juan Updated");
    });

    test("falla con body vacío", async () => {
        const res = await request(app).put("/alumnos/1").set(auth()).send({});
        expect(res.status).toBe(400);
    });

    test("falla con ID inválido", async () => {
        const res = await request(app).put("/alumnos/abc").set(auth()).send({
            nombre: "Juan"
        });
        expect(res.status).toBe(400);
    });
});

describe("DELETE /alumnos/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("elimina un alumno existente", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1 }]
        });

        const res = await request(app).delete("/alumnos/1").set(auth());

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Alumno eliminado");
    });

    test("retorna 404 si el alumno no existe", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).delete("/alumnos/999").set(auth());

        expect(res.status).toBe(404);
    });

    test("falla con ID inválido", async () => {
        const res = await request(app).delete("/alumnos/abc").set(auth());
        expect(res.status).toBe(400);
    });
});
