const connection = require('../config/config');
const mysql = require('mysql');

function ejecutarStoredProcedure(nombreSP, parametros) {
    return new Promise((resolve, reject) => {
      // Preparar el query del Stored Procedure
      let query = `CALL ${nombreSP}(${parametros.map(param => mysql.escape(param)).join(',')})`;
      console.log(query)
      // Ejecutar el query
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.log("error ->",error)
          reject(error);
          return;
        }
        resolve(results);
      });
    });
}

function ejecutarStoredProcedurev2(nombreSP, parametros) {
    return new Promise((resolve, reject) => {
      let query = `CALL ${nombreSP}(${parametros
        .map(param => {
            let escaped = mysql.escape(param);
            // Quitar diagonales invertidas solo para strings JSON
            if (typeof param === 'string' && (param.trim().startsWith('[') || param.trim().startsWith('{'))) {
                escaped = escaped.replace(/\\/g, '');
            }
            return escaped;
        })
        .join(',')})`;

      console.log(query); // query limpio sin \
      
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.log("error ->", error);
          reject(error);
          return;
        }
        resolve(results);
      });
    });
}

module.exports = {
    ejecutarStoredProcedure,
    ejecutarStoredProcedurev2
}