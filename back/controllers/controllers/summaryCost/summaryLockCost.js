const { ejecutarStoredProcedure } = require('../../queries/projects')
const { ejecutarVistaTools } = require('../../queries/executeViews')

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

async function setLockSummaryCost(req, res){
    try {

        let IDUser = await catchUserLogged(req);

        const resultados = await ejecutarStoredProcedure('sp_Set_lock_cost_summary', [
            req.body.action,
            IDUser.IDUser,
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        console.log(error);
    }
}

async function getLockSummaryCost(req, res){
    try {
        const resultados = await ejecutarVistaTools('vw_sc_lock_costsummary');
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { 
    setLockSummaryCost,
    getLockSummaryCost,
}