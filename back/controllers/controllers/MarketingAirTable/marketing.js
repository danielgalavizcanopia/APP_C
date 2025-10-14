const { ejecutarStoredProcedure } = require('../../queries/projects')

function getActivitiesByRPmark(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetCatActMarketing', [req.params.rp, req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
} 

function getReportingByActivitymark(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getReporteosByActividadMarketing', [req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
} 
module.exports = {
    getActivitiesByRPmark,
    getReportingByActivitymark
}