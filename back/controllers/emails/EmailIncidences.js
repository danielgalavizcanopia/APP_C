const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD // ⚠️ usar variable de entorno también
    },
})

async function sendmailIncidence(body) {
  try {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    const fechaInicioActividades = body.DateIncidence.toLocaleDateString("es-ES", options)

    
    const templatePath = path.join(__dirname, '../../utils/templates/emailIncidenceTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace(`{{usuario}}`, body.UserNotify);
    htmlTemplate = htmlTemplate.replace(`{{projectName}}`, body.ProjectName);
    htmlTemplate = htmlTemplate.replace(`{{IncidenceDate}}`, fechaInicioActividades);
    htmlTemplate = htmlTemplate.replace(`{{ProjectLog}}`, body.Foliobitacora);
    htmlTemplate = htmlTemplate.replace(`{{IncidenceType}}`, body.ShortDescIncidenceType);
    htmlTemplate = htmlTemplate.replace(`{{ImpactType}}`, body.ShortDescriptionImpact);
    htmlTemplate = htmlTemplate.replace(`{{responsible}}`, body.UsuarioNombre);
    htmlTemplate = htmlTemplate.replace(`{{projectManager}}`, body.UserNotify);
    htmlTemplate = htmlTemplate.replace(`{{EvidencesCount}}`, body.TotalEvidences ?  "Evidences: " + body.TotalEvidences : '');

    let mailToMe = {
      from: process.env.SMTP_USER,
      to: body.EmailNotificar, //body.EmailNotificar, // PARA PRUEBAS, COLOCAR CORREO CANOPIA
      subject: "CANOPIA - Incidence Notification",
      html: htmlTemplate
    };

    if(body.Idstatusreporteoactividades && body.Idstatusreporteoactividades == 3){
      mailToMe.bcc = body.CorreosNotificacion.split(', ')
      // mailToMe.bcc = ["luis@CanopiaCarbon918.onmicrosoft.com", "jessica@CanopiaCarbon918.onmicrosoft.com", "jair@CanopiaCarbon918.onmicrosoft.com"]
    }

    const info = await transporter.sendMail(mailToMe);
    console.log("Correo enviado:", info.response);

    return {
      status: "success",
      message: "Correo enviado correctamente",
      to: "jair@canopiacarbon.com",
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
  sendmailIncidence
};
