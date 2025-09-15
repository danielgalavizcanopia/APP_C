const { ejecutarStoredProcedure } = require('../../queries/projects');


async function getSummaryCostByProject(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getSC_ProjectCostSummary', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

module.exports = { 
    getSummaryCostByProject
}