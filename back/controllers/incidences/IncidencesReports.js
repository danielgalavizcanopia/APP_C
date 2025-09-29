const { ejecutarStoredProcedure } = require('../../queries/projects')
const { sendmailIncidence } = require('../emails/EmailIncidences')
const jwt = require('jsonwebtoken');

function catchUserLogged(req) {
    return new Promise(function (resolve, reject){
        const token = req.header('Authorization').split(" ")[1];
        if(!token){
            resolve({error: "no hay usuario logueado"})
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            resolve({IDUser: decoded.IDUser});
        }
    });
};


function setIncidences(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);
        let CanopiaInvolved = req.body.CanopiaInvolved;
        try {            
            const resultados = await ejecutarStoredProcedure('sp_setIdIncidence', [
                req.body.IdIncidence,
                req.body.idprojects,
                req.body.UserReporting, //Name SIL
                req.body.incidenceType,
                req.body.DateIncidence,
                req.body.LocationIncidence,
                req.body.IdIncidentImpact, 
                req.body.ForestryOwner,
                req.body.IdInvolvedSIL, // SON LOS CAMPOS QUE SE QUITARÁN PARA METER LA RELACIÓN 
                // req.body.CCinvolved, // SON LOS CAMPOS QUE SE QUITARÁN PARA METER LA RELACIÓN
                req.body.OthersInvolved,
                req.body.IncidenceCauses, 
                req.body.IncidenceDescription, 
                req.body.ImmediateActions, 
                req.body.Impact, 
                req.body.ForestryOwnerRequirements, 
                req.body.SILRequirements, 
                req.body.DateSuggestedAttention,
                req.body.idbitacora, 
                req.body.Idusuariosname,
                req.body.notifyTo,
                1, 
                IDUser.IDUser
            ]);
            if(resultados.length > 0){
                const idIncidence = resultados[0][0]?.IdIncidence
                /** CASO DE USO 1 - CUANDO SE CREA UNA INCIDENCIA, SE MANDA CORREO */
                if(!req.body.IdIncidence){
                    await sendmailIncidence(resultados[0][0])
                }
                /** FOR PARA GUARDAR CANOPIA INVOLVED */
                for(let i=0; i < CanopiaInvolved.length; i++){
                    let CInvolved = CanopiaInvolved[i]
                    const ods = await ejecutarStoredProcedure('sp_setIncidenceRelCanopiaInvolved', [
                        CInvolved.IdincidenceRelCanopiaInvolved,
                        CInvolved.IdIncidence ? CInvolved.IdIncidence : idIncidence,
                        CInvolved.Idusuariosname,
                        CInvolved.p_Status,
                    ]);
                    if(ods.length > 0){
                        if(i + 1 == CanopiaInvolved.length){
                            res.status(200).json({valido: 1, result: resultados[0]});
                        }
                    }
                }
                // res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getCanopiaInvolvedByIncidence(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);

        try {            
            const resultados = await ejecutarStoredProcedure('sp_GetIncidenceRelCanopiaInvolved',[req.params.id])
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function setInvolvedSIL(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);

        try {            
            const resultados = await ejecutarStoredProcedure('sp_setInvolvedSIL', [
                req.body.IdInvolvedSIL,
                req.body.InvolvedName,
                IDUser.IDUser,
            ]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getIndicencesByProject(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);

        try {            
            const resultados = await ejecutarStoredProcedure('sp_getIncidencesByProject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function setIncidenceStatus(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);

        try {            
            const resultados = await ejecutarStoredProcedure('sp_INSERTIncidenceStatus', [
                req.body.IdIncidence,
                req.body.Idstatusreporteoactividades,
                req.body.StatusDescription,
                IDUser.IDUser
            ]);
            if(resultados.length > 0){
                /** CASO DE USO 2 - CUANDO SE CIERRA LA INCIDENCIA, SE MANDA CORREO, SE MANDA CORREO */
                if(req.body.Idstatusreporteoactividades == 3){
                    await sendmailIncidence(resultados[0][0]) 
                }
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function setEvidencesByIncidences(req, res){
    return new Promise(async function (resolve, reject){
        let IDUser = await catchUserLogged(req);

        try {            
            const resultados = await ejecutarStoredProcedure('sp_setIncidenceevidence', [
                req.body.IdIncidenceEvidence,
                req.body.IdIncidence,
                req.body.EvidenceLink,
                req.body.nameevidence,
                req.body.status, 
                IDUser.IDUser
            ]);
            if(resultados.length > 0){
                /** CASO DE USO 2 - CADA QUE SE SUBE UNA EVIDENCIA NUEVA, SE MANDA CORREO */
                await sendmailIncidence(resultados[0][0])
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}


function getEvidencesByIncidence(req, res){
    return new Promise(async function (resolve, reject){

        try {            
            const resultados = await ejecutarStoredProcedure('sp_GetincidenceevidencebyID', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getHistoryStatus(req, res){
    return new Promise(async function(resolve, reject){

        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetincidencestatusbyID', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            
        }
    });

}

async function setDeleteIncidences(req, res){
        try {            
            const resultados = await ejecutarStoredProcedure('sp_set_deleteIncidences', [
                req.body.IdIncidence,
            ]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
}

module.exports = {
    setIncidences,
    setInvolvedSIL,
    getCanopiaInvolvedByIncidence,
    getIndicencesByProject,
    setIncidenceStatus,
    setEvidencesByIncidences,
    getEvidencesByIncidence,
    getHistoryStatus,
    setDeleteIncidences,
}