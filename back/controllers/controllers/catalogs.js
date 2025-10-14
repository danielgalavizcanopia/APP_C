const { getEstados, getAggregation } = require('../queries/catalogs');
const { ejecutarStoredProcedure } = require('../queries/catalogs')

function getCEstados(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getEstados();
            if(resultados.length > 0){
                res.status(201).json({valido: 1, estados: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMunicipalitiesByEstado(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetMunicipiosByEstado',[req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, municipios: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getNucleoAgrarioByMunicipality(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetNucleoAgrarioByMunicipio',[req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, nucleosag: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCAggregation(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getAggregation();
            if(resultados.length > 0){
                res.status(201).json({valido: 1, aggregation: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getCEstados,
    getMunicipalitiesByEstado,
    getNucleoAgrarioByMunicipality,
    getCAggregation
}
