const { getCatalogs } = require('../../queries/catalogs');
const { getCatalogsCondicionado } = require('../../queries/catalogs');
const { ejecutarVistaTools } = require('../../queries/executeViews');

function getCapexSubAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_capex_subaccount');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOpexSubAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_opex_subaccount');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCoordinadores(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionscoordinador');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCoordinadores(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionscoordinador');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getSOPs(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_SOP');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getStatusAnnualPlan(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_statusvalidateplan');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getCoordinadores(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionscoordinador');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getejecutorCampo(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionejecutorcampo');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            console.log(error);
            
        }
    });
}

function getevaluador(req, res){
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

function getseguimiento(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionsseguimiento');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getsupervisores(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_usuarios_positionssupervisor');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getStatusValidacion(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusValidacion');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getIndicadoresCuantitativos(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogsCondicionado('ct_cuantitativos');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getIndicadoresCuantitativosByKPI(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_cuantitativos_rel_kpi');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCtActivities(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarVistaTools('vw_ct_activities');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOds(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_ods');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getRelatedGoals(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_globalgoals_targets');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMainManagers(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('vw_gerentes');
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
    getSOPs,
    getCoordinadores,
    getejecutorCampo,
    getevaluador,
    getseguimiento,
    getsupervisores,
    getStatusValidacion,
    getIndicadoresCuantitativos,
    getIndicadoresCuantitativosByKPI,
    getCapexSubAccounts,
    getOpexSubAccounts,
    getOds,
    getCtActivities,
    getRelatedGoals,
    getStatusAnnualPlan,
    getMainManagers,
}