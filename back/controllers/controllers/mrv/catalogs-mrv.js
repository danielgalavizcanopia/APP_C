const { getCatalogs } = require('../../queries/catalogs');

function getMrvLead(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_leadmrv');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getleakeage(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_leakeage');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getmrvrequirements(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_mrvrequirements');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getpermanence(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_permanence');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getstatusmrv(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusmrv');
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
    getMrvLead,
    getleakeage,
    getmrvrequirements,
    getpermanence,
    getstatusmrv
}