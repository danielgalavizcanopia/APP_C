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

async function getMRV(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetMrvByProyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setMRV(req, res) {

    let IDUser = await catchUserLogged(req);

    try {
        const resultados = await ejecutarStoredProcedure('sp_setMrv', [req.body.Idmrv, req.body.Idproject, req.body.IdleadMRV, req.body.IdPermanence, req.body.Idleakeage,
            req.body.RevesalRisk, req.body.SampleSize, req.body.IdMRVRequirements, req.body.BLInventoryStartDate, req.body.BLInventoryEndDate, req.body.IdMRVStatus,
            req.body.CommentsofMRV, IDUser.IDUser]);
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
    getMRV,
    setMRV
}