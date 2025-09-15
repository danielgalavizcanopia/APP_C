const connection = require('../config/config');
const mysql = require('mysql');


function getEstados(){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ct_estado`;
    
        connection.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
}

function getAggregation(){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ct_aggregation`;
    
        connection.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
}

function getCatalogs(catalogName){
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${catalogName}`;

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getCatalogsCondicionado(catalogName) {
  return new Promise((resolve, reject) => {
    // Modifica la consulta para incluir una cláusula WHERE
    const query = `SELECT * FROM ${catalogName} WHERE Status != 0`;

    connection.query(query, (err, results) => {
      if (err) {
        reject(err); // Rechaza la promesa en caso de error
      } else {
        resolve(results); // Resuelve la promesa con los resultados filtrados
      }
    });
  });
}

function ejecutarStoredProcedure(nombreSP, parametros) {
    return new Promise((resolve, reject) => {
      // Preparar el query del Stored Procedure
      let query = `CALL ${nombreSP}(${parametros.map(param => mysql.escape(param)).join(',')})`;
      // Ejecutar el query
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
}

function OriginationPercentage(idProject){
  return new Promise((resolve, reject) => {
      const query = `select PercentageMktPrice from tb_originacion where Idproject = ${idProject}`;

      connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
}


module.exports = {
    getEstados,
    getAggregation,
    ejecutarStoredProcedure,
    getCatalogs,
    getCatalogsCondicionado,
    OriginationPercentage
}