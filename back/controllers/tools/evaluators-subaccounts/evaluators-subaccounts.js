const { ejecutarStoredProcedure } = require('../../../queries/projects');
const { ejecutarVistaTools } = require('../../../queries/executeViews')

async function getSubAccountsCatalog(req, res){
    try {
        const resultados = await ejecutarVistaTools('vw_fmtools_subaccount_authorization');
        if(resultados){
            res.status(200).json({valido: 1, result: resultados});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
    }
}

async function getManagersBySubaccount(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getFM_UsersBySuba', [
            req.params.type, 
            req.params.subaccount
        ]);
        if(resultados){
            res.status(200).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
    }
}

async function getCatalogManagers(req, res){
    try {
        const resultados = await ejecutarVistaTools('vw_fm_user_roles');
        if(resultados){
            res.status(200).json({valido: 1, result: resultados});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
    }
}

module.exports = {
    getSubAccountsCatalog,
    getManagersBySubaccount,
    getCatalogManagers
}