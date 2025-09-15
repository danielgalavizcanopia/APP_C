const { ejecutarStoredProcedure } = require('../../queries/projects')

function getpedArea(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetPedSigByProyecto', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function insertPEDarea(req, res){
    return new Promise(async (resolve, reject) => {
        try {

            const resultados = await ejecutarStoredProcedure('sp_setPedSig', [req.body.IdPED, req.body.idprojects, req.body.IdAreaactividad,
                                                                                         req.body.IdResultadoPEDAP, req.body.IncluirANPoADVC,
                                                                                         req.body.IncluirPSA, req.body.RequiereQExistaAC, req.body.RequiereSubsidios,
                                                                                         req.body.IdSeccionPEDAA, req.body.IdPoblacionAA, req.body.IdActividadAgropecuaria,
                                                                                         req.body.IdEncuestas, req.body.IdSubsidiosAA, req.body.IdPendienteAA,
                                                                                         req.body.IdCambioCoberturaAA, req.body.IdResultadoPEDAA, req.body.LinkPEDAA,
                                                                                         req.body.ObservacionesPEDAA, req.body.IdLeadSIG
                                                                                        ]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 1, message: "Se guardó correctamente"});
            }  else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getpedArea,
    insertPEDarea,
}