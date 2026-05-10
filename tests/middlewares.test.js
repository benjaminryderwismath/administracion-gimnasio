
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

const auth = { Authorization: `Bearer ${token}` };

describe("Middleware: verifyToken", () => {
    beforeEach(() => jest.clearAllMocks());

    test("rechaza petición sin token", async () => {
        const res = await request(app).get("/alumnos");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Token requerido");
    });

    test("rechaza token inválido", async () => {
        const res = await request(app)
            .get("/alumnos")
            .set("Authorization", "Bearer token_inventado");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Token invalido");
    });

    test("acepta token válido", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get("/alumnos")
            .set(auth);

        expect(res.status).toBe(200);
    });
});

describe("Middleware: validateId", () => {
    beforeEach(() => jest.clearAllMocks());

    test("rechaza ID string (abc)", async () => {
        const res = await request(app).get("/alumnos/abc").set(auth);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("ID inválido");
    });

    test("rechaza ID negativo", async () => {
        const res = await request(app).get("/alumnos/-1").set(auth);
        expect(res.status).toBe(400);
    });

    test("rechaza ID cero", async () => {
        const res = await request(app).get("/alumnos/0").set(auth);
        expect(res.status).toBe(400);
    });

    test("acepta ID válido", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Juan", email: "juan@gym.com" }]
        });

        const res = await request(app).get("/alumnos/1").set(auth);
        expect(res.status).toBe(200);
    });
});

describe("Middleware: validateSchema (Zod)", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna 400 con mensaje de Zod cuando el body es inválido", async () => {
        const res = await request(app)
            .post("/alumnos")
            .set(auth)
            .send({ nombre: "A", email: "no-es-email" });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(typeof res.body.message).toBe("string");
    });

    test("pasa la validación con body correcto", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 3, nombre: "Carlos", email: "carlos@gym.com" }]
        });

        const res = await request(app)
            .post("/alumnos")
            .set(auth)
            .send({ nombre: "Carlos", email: "carlos@gym.com" });

        expect(res.status).toBe(201);
    });
});
