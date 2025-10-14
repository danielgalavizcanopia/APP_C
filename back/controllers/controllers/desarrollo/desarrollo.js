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


async function getDesarrolloByProject(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetDesarrolloByProject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setDesarrolloAndCRT(req, res) {
let IDUser = await catchUserLogged(req);

    let totalCRT = req.body[2022] + req.body[2023] + req.body[2024] + req.body[2025] + req.body[2026] + req.body[2027] + req.body[2028] + req.body[2029] + req.body[2030] + req.body[2031] + req.body[2032] + req.body[2033] + req.body[2034] + req.body[2035] + req.body[2036] + req.body[2037] + req.body[2038] + req.body[2039] + req.body[2040] + req.body[2041] + req.body[2042] + req.body[2043] + req.body[2044] + req.body[2045] + req.body[2046] + req.body[2047] + req.body[2048] + req.body[2049] + req.body[2050] + req.body[2051] + req.body[2052]
    try {
        const resultados = await ejecutarStoredProcedure('sp_setDesarrolloAndCrts', [
            req.body.Iddesarrollo,
            req.body.Idproject,
            req.body.Description,
            req.body.UnderlyingActivities,
            req.body.IdLicensesPermits,
            req.body.IdleadDesarrollo,
            req.body.IdDevelopmentStatus,
            req.body.idprogramme,
            req.body.RegistrationRoute,
            req.body.Idmethodology,
            req.body.Credittype,
            req.body.IdConfidenceOfFrontCost,
            req.body.IdCBACalculatorVersion,
            req.body.CBAFileReference,
            req.body.ProjectIRR,
            req.body.ProjectAreaHA, // ProjectAreaHA
            0,
            req.body.IdConfidenceofCreditingActivityArea,
            req.body.IdProjectCondition,
            req.body.ApprovedByCounterPartProject.split("T")[0],
            req.body.Expectec2ndCreditInPeriod.split("T")[0],
            req.body.IdERsCalculatorVersion,
            req.body.IdMercuriaDDStatus,
            req.body.DDPack,
            req.body.DDPacktoMeSubmission.split("T")[0],
            req.body.IdEstimatePermanence,
            req.body.IdEstimateLeakeAge,
            req.body.EstimatedReversalRisk,
            req.body.IdEstimatedMRVRequirements,
            req.body.EstimateSampleSize,
            req.body.TotalCert10YrsTCO2,
            req.body.DevelopmentTeamNotes,
            IDUser.IDUser,
            IDUser.IDUser,
            req.body[2022],
            req.body[2023],
            req.body[2024],
            req.body[2025],
            req.body[2026],
            req.body[2027],
            req.body[2028],
            req.body[2029],
            req.body[2030],
            req.body[2031],
            req.body[2032],
            req.body[2033],
            req.body[2034],
            req.body[2035],
            req.body[2036],
            req.body[2037],
            req.body[2038],
            req.body[2039],
            req.body[2040],
            req.body[2041],
            req.body[2042],
            req.body[2043],
            req.body[2044],
            req.body[2045],
            req.body[2046],
            req.body[2047],
            req.body[2048],
            req.body[2049],
            req.body[2050],
            req.body[2051],
            req.body[2052],
            totalCRT
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1,result: resultados[0][0]});
          } else {
            res.status(404).json({ message: "No data found for the given project ID." });
          }
        } catch (error) {
          res.status(500).json({ message: "An error occurred while processing your request." });
        }
    }

module.exports = {
    getDesarrolloByProject,
    setDesarrolloAndCRT,
}