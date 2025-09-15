const { ejecutarStoredProcedure } = require('../../queries/catalogs')
const { ejecutarVistaTools } = require('../../queries/executeViews')
const { getCatalogs } = require('../../queries/catalogs');


function setActivities(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_setActivitiesprojects',[
                req.body.idactivitiesprojects,
                req.body.projectsactivities,
                req.body.LargeDescriptionactivities,
                req.body.Idmacroprocess,
                req.body.status
            ]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getActivities(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_activitiesprojects');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMacroProcess(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_macroprocess');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    setActivities,
    getActivities,
    getMacroProcess,
}