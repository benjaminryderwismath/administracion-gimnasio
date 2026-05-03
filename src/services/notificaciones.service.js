
const twilio = require("twilio");
const nodemailer = require("nodemailer");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarRecordatorio = async (alumno) => {
    const mensaje = `Hola ${alumno.nombre}, tu plan vence el ${alumno.vencimiento}`;

    
    if (alumno.telefono) {
        await client.messages.create({
            body: mensaje,
            from: process.env.TWILIO_PHONE,
            to: `whatsapp:${alumno.telefono}`
        });
    }

    if (alumno.email) {
        await transporter.sendMail({
            from: "Gym",
            to: alumno.email,
            subject: "Vencimiento de plan",
            text: mensaje
        });
    }
};

module.exports = { enviarRecordatorio };