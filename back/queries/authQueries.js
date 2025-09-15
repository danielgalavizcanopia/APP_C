
const mysql = require('mysql');
const connection = require('../config/config');
// Función para insertar un nuevo usuario en la base de datos
function RegisterUser(user) {
  return new Promise (function(resolve, reject){
    const sql = 'INSERT INTO tb_usuarios (Name, Email, Status, DateCreate, IDUserCreate, DateModify, IDUserModify, Password, id_positions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [user.Name, user.Email, 1, new Date(), 1, new Date(), 1, user.password, 4], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario: ' + err.message);
        return resolve({valido: 0, mensaje: "An internal error has occurred, please try again later", resp: err.message});
      }
        return resolve({valido: 1, mensaje: "Usuario creado correctamente"});
    });
  })
}


// function checkIfExistUser(Email){
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM tb_usuarios WHERE Email = ?`;
    
//         connection.query(query, [Email], (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results.length ? results[0] : null);
//           }
//         });
//       });
// }

function checkIfExistUser(parametros) {
  return new Promise((resolve, reject) => {
    // Preparar el query del Stored Procedure
    let query = `CALL sp_GetUserbyEmail(${"'" + parametros + "'"})`;
    console.log(query)
    // Ejecutar el query
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.log("error ->",error)
        reject(error);
        return;
      }
      resolve(results[0][0]);
    });
  });
}


function checkPermissions(Email){
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM tb_usuarios_areas_permisos WHERE IDUser = ?`;
  
      connection.query(query, [Email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length ? results : null);
        }
      });
    });
}


module.exports = {
    RegisterUser,
    checkIfExistUser,
    checkPermissions
    
}