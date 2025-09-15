const { ejecutarStoredProcedure } = require('../../queries/projects');
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

async function getUpfrontCostByProject(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getSC_UpfrontCostsByProject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function setUpfrontCostByProject(req, res){
    try {
        let IDUser = await catchUserLogged(req);

        const resultados = await ejecutarStoredProcedure('sp_Set_SC_UpfrontCostsUsd', [
            req.body.Idupdfront,
            req.body.Idproject,
            req.body.CAPEX_of_Projects,
            req.body.CAROnsiteVerification, 
            req.body.CCBSOnsiteVerification, 
            req.body.Social_Monitoring, 
            req.body.MonitoringBaseline, 
            req.body.OnsiteImplementation, 
            req.body.Project_Management_Expenses, 
            req.body.PDDDevelopment, 
            req.body.Registration, 
            req.body.VerificationSupport, 
            req.body.Legal_and_Tax_Services, 
            req.body.Notary_Services, 
            req.body.Contingency, 
            IDUser.IDUser
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

module.exports = {
    getUpfrontCostByProject,
    setUpfrontCostByProject
}