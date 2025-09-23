const { ejecutarStoredProcedure } = require('../../../queries/projects');

async function getByAccountDetails(req, res){
    try {
        const body = req.body
        const resultados = await ejecutarStoredProcedure('sp_getFM_Actualbyaccounts',[
            body.idprojects,
            body.idrpnumber,
            body.idcapexsubaccount,
            body.idopexsubaccount,
        ]);
        if(resultados){
            res.status(200).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getByAccountDetails
}