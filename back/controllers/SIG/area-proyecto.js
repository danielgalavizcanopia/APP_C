const { ejecutarStoredProcedure } = require('../../queries/projects')

function getviewAreaPHist(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetAreadeProyectoHistByProyecto', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getviewAreaPById(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetAreadeProyectoByProyecto', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function setAreaProyecto(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_setAreadeProyecto_and_SETAreadeProyectoHist', [
                req.body.idAreaProyecto, req.body.IdProject,
                req.body.idCertificacionUpdate, req.body.superficieTotalPhinaToUpdate, req.body.achuradoToUpdate,
                req.body.expopriadoToUpdate, req.body.linkPHINAToUpdate, req.body.superficieTotalUpdate, req.body.idsolicitudRANUpdate,
                req.body.superficiePlanoInternoUpdate, req.body.areasExpropiadasUpdate, req.body.añoDelPlanUpdate,
                req.body.linkPlanoInternoUpdate, req.body.idStatusValidacionAPUpdate, req.body.observacionesAPUpdate,
                req.body.linkAPUpdate, req.body.idLeadSIGUpdate, req.body.usuarioQueRealizaElCambio,
            ]);
            if(resultados[0][0].Resultado  == "Transacción completada con éxito."){
                res.status(201).json({valido: 1, result: resultados[0][0].Resultado});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = { 
    getviewAreaPHist,
    getviewAreaPById,
    setAreaProyecto
}