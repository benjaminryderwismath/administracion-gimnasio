
const express = require("express");
const cors = require("cors");
const app = express();
const pagosRoutes = require("./routes/pagos.routes");
const reportesRoutes = require("./routes/reportes.routes");

app.use(cors({
  origin: "*",  // en producción podés restringir al dominio real
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Gym Management API running 🚀");
});

app.use("/auth", require("./routes/auth.routes"));
app.use("/profesores", require("./routes/profesores.routes"));
app.use("/alumnos", require("./routes/alumno.routes"));
app.use("/inscripciones", require("./routes/inscripciones.routes"));
app.use("/pagos", pagosRoutes);
app.use("/reportes", reportesRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
    status: "error",
    message: err.message || "Error interno en el servidor"
    });
});

module.exports = app;