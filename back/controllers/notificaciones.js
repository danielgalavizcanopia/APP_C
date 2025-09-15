const { ejecutarStoredProcedure } = require('../queries/projects')


function ctNotify(req, res){
    return new Promise(async function(resolve, reject){
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetroyectohistByStatusAu', []);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, ctNotify: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    })
}

function ctNotifyAllStatus(req, res){
    return new Promise(async function(resolve, reject){
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetSolicitudes', []);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, allNotifications: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    })
}

module.exports = {
    ctNotify,
    ctNotifyAllStatus
}