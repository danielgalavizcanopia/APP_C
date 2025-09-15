const mysql = require('mysql');
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs');
// const serverCa = [fs.readFileSync("./DigiCertGlobalRootCA.pem", "utf8")];

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port:'3306',
//     user: 'root',
//     password: '1234',
//     database: process.env.DATABASE
// });

// /** ARCHIVO SSL BORRADO POR SEGURIDAD */
const connection = mysql.createConnection({
    host:"dbportafolio.mysql.database.azure.com",
    user:"CanopiaUserBD", 
    password: process.env.PASSWORD, 
    database: process.env.DATABASE, 
    port:3306, 
    ssl:{ca:fs.readFileSync("./config/azure-combined-root-ca.pem")}});

module.exports = connection;