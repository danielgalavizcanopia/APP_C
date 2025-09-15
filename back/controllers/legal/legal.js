const { ejecutarStoredProcedure } = require('../../queries/projects')
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

async function getLegal(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetLegalByProyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setLegal(req, res) {
    let IDUser = await catchUserLogged(req);

    try {
        const resultados = await ejecutarStoredProcedure('sp_setLegal', [req.body.LegaID, req.body.idproject, req.body.idleadlegal, req.body.idlegalDDStatus,
            req.body.LolSignedDate, req.body.KYCCompleted, req.body.CBRequestedRAN, req.body.CBCompleted, req.body.ERPASignedDate, req.body.Buyer,
            req.body.ProjectAgregator, req.body.ProjectDevelopment, req.body.ProjectCoordinator, req.body.ProjectCoordinatorTerm, req.body.SpecificConditionsPrescendent, 
            req.body.KYCtoMESubmission, req.body.KYC, req.body.IDMeKYCStatus, req.body.NotesLegalTEam, IDUser.IDUser]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

module.exports = {
    getLegal,
    setLegal
}