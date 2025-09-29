const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const { getBearerToken } = require('../../controllers/financialMonitoring/Sharepoint');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD
    },
})

let transporterMaileroo = nodemailer.createTransport({
    host: 'smtp.maileroo.com',
    port: '465, 587, 2525',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PWD,
    },
    secure: false,
    requireTLS: true,
})

async function sendmail(req) {
  try {

    const mailToMe = {
      from: process.env.SMTP_USER,
      to: req.body.emaildest,
      subject: req.body.subject,
      // html: htmlTemplate,
      text: 'Prueba de un envio de correo sin usar gmail.'
    };

    const info = await transporterMaileroo.sendMail(mailToMe);
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

async function sendMailgraph(req, res, senderUser) {
  try {
    let token = await getBearerToken();

  const mail = {
    message: {
      subject: "test",
      body: {
        contentType: "HTML",
        content: "contenido test",
      },
      toRecipients: [
        {
          emailAddress: {
            address: "luis@CanopiaCarbon918.onmicrosoft.com",
          },
        },
      ],
    },
    saveToSentItems: "true",
  };

  const url = `https://graph.microsoft.com/v1.0/users/jair@CanopiaCarbon918.onmicrosoft.com/sendMail`;

  await axios.post(url, mail, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  return { success: true, message: "Correo enviado 🚀" };
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {
  sendmail,
  sendMailgraph
};
