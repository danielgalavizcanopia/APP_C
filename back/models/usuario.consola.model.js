'use strict'
const helpers = require('../modules/helpers');

module.exports = {
    verificaExistUsr: verificaExistUsr,
    ObtenerUsuarioId: ObtenerUsuarioId,
}

function verificaExistUsr(email) {  
    return helpers.mysqlQuery('GET', conn_mysql,
        `call getExistUsr(@username);`
        , email)
}

function ObtenerUsuarioId(id) {
    return helpers.mysqlQuery('GET', conn_mysql,
        `call getUsrById(@id_usuario_sistema); `
        , id)
}
