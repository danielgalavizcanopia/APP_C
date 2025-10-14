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

async function getAnnualCostDeductionsByProject(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getSC_AOyMCDByproject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function setAnnualCostDeductionsByProject(req, res){
    try {
        let IDUser = await catchUserLogged(req);

        const upfrontCostDArray = req.body.annualCostD;

        for(let i = 0; i < upfrontCostDArray.length; i++) {
            const upfrontCostD = upfrontCostDArray[i];
            const resultados = await ejecutarStoredProcedure('sp_Set_SC_AOyMCDByproject', [
                upfrontCostD.Idannualcostddaoymcd,
                upfrontCostD.idprojects,
                upfrontCostD.valorAOyMCD,
                upfrontCostD.idrpnumber,
                IDUser.IDUser
            ]);
            if(i == upfrontCostDArray.length - 1) {
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
    getAnnualCostDeductionsByProject,
    setAnnualCostDeductionsByProject
}