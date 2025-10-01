const { ejecutarStoredProcedure, ejecutarStoredProcedurev2 } = require('../../../queries/projects');
const { ejecutarVistaTools } = require('../../../queries/executeViews')

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
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        
    }
}

async function setReviewActualRequest(req, res){
    try {

        let IDUser = await catchUserLogged(req);
        const body = req.body;
        const requests = JSON.stringify(body.requests);
        const resultados = await ejecutarStoredProcedurev2('sp_Set_FM_ReviewRequest',[
            body.idprojects,
            body.ledgerType,
            body.idrpnumber,
            body.idsubaccount,
            body.justification,
            IDUser.IDUser,
            requests
        ]);
        if(resultados){
            res.status(200).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        console.log(error);
    }
}

async function getActualRequests(req, res){
    try {
        const resultados = await ejecutarVistaTools('vw_fm_actualreviewrequest');
        if(resultados){
            res.status(200).json({valido: 1, result: resultados});
        }
    } catch (error) {
        console.log(error);
    }
}

async function getTransactionsDetailsByID(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getFM_actualreviewrequest_detail',[
            req.params.id
        ]);
        if(resultados){
            res.status(200).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        
    }
}

async function getHistoryActualRequest(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_getFM_Actualrequest_authorization',[
            req.params.id
        ]);
        if(resultados){
            res.status(200).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        
    }
}



async function setAuthotizationRequest(req, res){
    try {

        const body = req.body;

        if(body.typeOfAutho == 1){
            /** APROBACIÓN DE 2 PERSONAS */
            const resultados = await ejecutarStoredProcedure('sp_Set_FM_AuthorizeRequestbyID',[
                body.Idactualreviewrequest,
                body.iduserautho,
                body.idstatusautho,
                body.AuthorizationComment,
            ]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        }

        if(body.typeOfAutho == 2){
            /** APROBACIÓN DE 3 PERSONAS */
            const resultados = await ejecutarStoredProcedure('sp_Set_FM_AuthorizeRequest',[
                body.Idactualreviewrequest,
                body.iduserautho,
                body.idstatusautho,
                body.AuthorizationComment,
            ]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getByAccountDetails,
    setReviewActualRequest,
    getActualRequests,
    getTransactionsDetailsByID,
    getHistoryActualRequest,
    setAuthotizationRequest,
}