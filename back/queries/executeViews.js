const connection = require('../config/config');

function ejecutarVistaMAct(nombreVista, idProject) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${nombreVista} WHERE idprojects = ${idProject}`, (err, results) => {
            if (err) {
              return;
            }
            resolve(results)
          });
    });
}

function ejecutarVistaTools(nombreVista, idProject) {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${nombreVista}`, (err, results) => {
          if (err) {
            return;
          }
          resolve(results)
        });
  });
}

module.exports = {
    ejecutarVistaMAct,
    ejecutarVistaTools
}