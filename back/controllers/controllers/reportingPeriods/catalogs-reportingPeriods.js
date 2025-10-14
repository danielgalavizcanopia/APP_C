const { getCatalogs } = require('../../queries/catalogs');


function getprogramme(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_programme');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getgroupreporting(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_group_reporting');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getregistrationroute(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_registrationroute');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getverifier(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_verifier');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getRPnumber(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_rpnumber');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getprogramme, 
    getgroupreporting, 
    getregistrationroute,
    getverifier,
    getRPnumber
}