const { ejecutarStoredProcedure } = require('../../queries/projects')

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

function getActivities(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetAreaActividadByProyecto', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function insertActivityArea(req, res){
    return new Promise(async (resolve, reject) => {
        try {

            const resultados = await ejecutarStoredProcedure('sp_setAreadeActividad', [req.body.IdProject, req.body.IdStatusValidacionAA, req.body.IdversionAA, req.body.ObservacionesAA, req.body.IdLeadSIG]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 0, message: "Se actualizó correctamente"});
            } else if(resultados[0][0].result == 0 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 0, message: "Se guardó correctamente"});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
module.exports = {
    getActivities,
    insertActivityArea,
}