const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD
    },
})

async function sendmail(req) {
  try {

    const mailToMe = {
      from: process.env.SMTP_USER,
      to: req.body.emaildest,
      subject: req.body.subject,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailToMe);
    console.log("Correo enviado:", info.response);

    return {
      status: "success",
      message: "Correo enviado correctamente",
      to: req.body.emaildest,
      timestamp: new Date()
    };

  } catch (error) {
    console.error("Error al enviar correo:", error);
    return {
      status: "error",
      message: "Error al enviar el correo",
      error: error.message,
      timestamp: new Date()
    };
  }
}

module.exports = {
  sendmail
};
