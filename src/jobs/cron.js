
const cron = require("node-cron");
const { enviarRecordatorios } = require("../services/recordatorios.service");


cron.schedule("0 9 * * *", async () => {
    console.log("🕐 Ejecutando job de recordatorios...");
    await enviarRecordatorios();
});

console.log("✅ Job de recordatorios configurado");