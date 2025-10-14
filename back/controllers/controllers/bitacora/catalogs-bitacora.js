const { ejecutarStoredProcedure } = require('../../queries/catalogs')
const { ejecutarVistaTools } = require('../../queries/executeViews')


function getHitosProcess(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_hitoproceso_concatenated');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCategoriaEvidencia(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetEvidenciaByHito', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getTipoEvidencia(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetTipoEvidenciaByCateg', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getHitosProcess,
    getCategoriaEvidencia,
    getTipoEvidencia,
}