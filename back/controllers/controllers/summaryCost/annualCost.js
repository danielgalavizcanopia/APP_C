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

async function getAnnualCostByProject(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getSC_anualcostByproject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function setAnnualCostByProject(req, res){
    try {
        let IDUser = await catchUserLogged(req);

        const annualCostArray = req.body.annualCosts

        for(let i = 0; i < annualCostArray.length; i++) {
            const annualCost = annualCostArray[i];
            const resultados = await ejecutarStoredProcedure('sp_Set_SC_anualcostopex', [
                annualCost.IdAnnualoCostsopex,
                annualCost.idprojects,
                annualCost.valor, 
                annualCost.idrpnumber, 
                IDUser.IDUser
            ]);

            if(i == annualCostArray.length - 1) {
                if (resultados.length > 0) {
                    res.status(200).json({valido: 1, result: resultados[0]});
                }
            }
        }

    } catch (error) {
        console.log(error);
        
    }
}
module.exports = { 
    getAnnualCostByProject,
    setAnnualCostByProject
}