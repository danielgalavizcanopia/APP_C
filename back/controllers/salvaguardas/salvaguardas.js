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

async function getSalvaguardas(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetSalvaguardasByProyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setSalvaguardas(req, res) {

    let IDUser = await catchUserLogged(req);
    

    try {
        const resultados = await ejecutarStoredProcedure('sp_setSalvaguardas', [req.body.Idsafeguards, req.body.Idproject, req.body.Leads, req.body.Statussafeguards,
            req.body.LastPPTtoProjectCounterPart, req.body.SafeguardsNoHarmApproach, req.body.SocialCommunityNoHarm, req.body.ShareholdersEngagement, req.body.PressNegative,
            req.body.Biodiversity, req.body.HumanRights, req.body.IndigenousPeople, req.body.HS, req.body.NegativeEHS, req.body.ProjectCoordinator, req.body.ProjectCoordinatorTerm,
            req.body.NotesSafeguardsTeam, IDUser.IDUser]);
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
    getSalvaguardas,
    setSalvaguardas
}