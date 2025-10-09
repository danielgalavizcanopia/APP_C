const { getCatalogs } = require('../../queries/catalogs');
const { ejecutarVistaTools } = require('../../queries/executeViews')
const { ejecutarStoredProcedure } = require('../../queries/projects')


function Getincidentimpact(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_incidentimpact');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getInvolvedSIL(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_involvedsil');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getStatusIncidence(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_status_incidences');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getIncidenceType(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_IncidenceType');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getLogByIdProject(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetFoliobitacorabyID',[req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCanopiaUsers(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarVistaTools('vw_usuarios_positionsevaluador');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getUserProManager(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarVistaTools('vw_users_pmsjuniors');
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
   
    /**Catalogos de Incidences */
    Getincidentimpact,
    getInvolvedSIL,
    getCanopiaUsers,
    getIncidenceType,
    getLogByIdProject,
    getStatusIncidence,
    getUserProManager
}