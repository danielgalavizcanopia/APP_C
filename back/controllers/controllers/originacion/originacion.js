const jwt = require('jsonwebtoken');
const { ejecutarStoredProcedure } = require('../../queries/projects')

/** CAPTURA USUARIO LOGUEADO PARA ENVIARLO EN LAS DEMÁS FUNCIONES */
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

async function getOrigination(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetOriginacionByProyecto', [req.params.id]);

        // Verificamos si hay resultados y si la primera fila contiene 'result'
        if (resultados.length > 0 && resultados[0][0].result) { // && resultados[1].length > 0 && resultados[1][0].result
            // Parsear la cadena JSON a objeto
            // const originationData = JSON.parse(resultados[1][0].result);
            // Devolver los datos en formato JSON
            res.status(200).json({valido: 1, origination: JSON.parse(resultados[0][0].result)});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

function insertOrigination(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            /** FUNCIÓN PARA OBTENER USUARIO LOGUEADO Y AGREGARLO A LOS SP */
            let IDUser = await catchUserLogged(req);

            let ProjectApproval = req.body.ProjectApproval ? req.body.ProjectApproval.split('T')[0] : '2000-01-01';
            let ERPAApproval = req.body.ERPAApproval ? req.body.ERPAApproval.split('T')[0] : '2000-01-01';
            let ExpectedERPASigningDate = req.body.ExpectedERPASigningDate ?req.body.ExpectedERPASigningDate.split('T')[0]  : '2000-01-01';

            const resultados = await ejecutarStoredProcedure('sp_SETOriginacion', [
                req.body.ProjectID, 
                req.body.ProjectCounterpart, 
                req.body.ImplementationPartner, 
                req.body.LandTenureType, 
                req.body.ProjectType, 
                req.body.Program,
                req.body.OriginationLead, 
                req.body.OriginationPromoter, 
                req.body.OriginationStatus,
                req.body.ApprovedBuyer, 
                ProjectApproval, 
                ERPAApproval,
                req.body.PercentageMktPrice,
                req.body.ProspectPriority, 
                req.body.ProjectAlive, 
                ExpectedERPASigningDate,
                req.body.ExpectedLOISigningDate, 
                req.body.NotesOriginationTeam, 
                req.body.NotesChanges,
                IDUser.IDUser
            ]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 1, message: "Se guardó correctamente"});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function updateOrigination(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            /** FUNCIÓN PARA OBTENER USUARIO LOGUEADO Y AGREGARLO A LOS SP */
            let IDUser = await catchUserLogged(req);

            let ProjectApproval = req.body.ProjectApproval ? req.body.ProjectApproval.split('T')[0] : '2000-01-01';
            let ERPAApproval = req.body.ERPAApproval ? req.body.ERPAApproval.split('T')[0] : '2000-01-01';
            let ExpectedERPASigningDate = req.body.ExpectedERPASigningDate ?req.body.ExpectedERPASigningDate.split('T')[0]  : '2000-01-01';


            const resultados = await ejecutarStoredProcedure('sp_UPDATEOriginacion', [ 
                req.body.IdOriginacion, 
                req.body.ProjectID, 
                req.body.ProjectCounterpart, 
                req.body.ImplementationPartner, 
                req.body.LandTenureType, 
                req.body.ProjectType, 
                req.body.Program,
                req.body.OriginationLead, 
                req.body.OriginationPromoter, 
                req.body.OriginationStatus,
                req.body.ApprovedBuyer, 
                ProjectApproval, 
                ERPAApproval,
                req.body.PercentageMktPrice,
                req.body.ProspectPriority, 
                req.body.ProjectAlive, 
                ExpectedERPASigningDate,
                req.body.ExpectedLOISigningDate, 
                req.body.NotesOriginationTeam, 
                req.body.NotesChanges,
                IDUser.IDUser]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 1, message: "Se guardó correctamente"});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


module.exports = { 
    getOrigination,
    insertOrigination,
    updateOrigination,
}