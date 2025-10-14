const { getCatalogs } = require('../../queries/catalogs');


function getLeadLegal(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_leadlegal');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getDDSattus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_legalddstatus');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMEKYCStatus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_mekycstatus');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProyectosLegal(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('tb_proyectos');
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
    getLeadLegal,
    getDDSattus,
    getMEKYCStatus,
    getProyectosLegal
}