const { getCatalogs, OriginationPercentage } = require('../../queries/catalogs');
const { ejecutarStoredProcedure } = require('../../queries/projects')
const { ejecutarVistaTools } = require('../../queries/executeViews')
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

function getSettlementCurrency(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_setlecurrency');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getPaymentType(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_prepayment');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getDeductionType(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_typeDeduction');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getStatusSettlement(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusSettlement');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getPercentageByProject(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await OriginationPercentage(req.params.id);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


async function setPrePaymentDeductions(req, res){
    try {
        let IDUser = await catchUserLogged(req);
        const body = req.body;
        const resultados = await ejecutarStoredProcedure('sp_Setct_prepayment_deduction', [
            body.Idprepaymentdeduction,
            body.Descripprepaymentdeduction,
            IDUser.IDUser
        ]);
        if(resultados.length > 0){
            res.status(200).json({valido: 1, result: resultados[0]});
        }

    } catch (error) {
        console.log(error);
    }
}

async function getPrePaymentDeductions(req, res){
        try {
            const resultados = await ejecutarVistaTools('vw_prepayment_deduction');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            console.log(error);
        }
}

async function deletePrePaymentDeduction(req, res){
    try {
        let IDUser = await catchUserLogged(req);
        const idToDelete = req.params.id; 
        
        // Enviar descripción VACÍA para eliminar (según tu jefe)
        const resultados = await ejecutarStoredProcedure('sp_Setct_prepayment_deduction', [
            idToDelete,
            "", // VACÍO en lugar de "DELETED"
            IDUser.IDUser
        ]);
        
        if(resultados.length > 0){
            res.status(200).json({
                valido: 1, 
                result: resultados[0],
                message: "Registro eliminado correctamente"
            });
        } else {
            res.status(500).json({
                valido: 0, 
                message: "No se pudo eliminar el registro"
            });
        }

    } catch (error) {
        console.log('Backend delete error:', error);
        res.status(500).json({
            valido: 0, 
            message: "Error interno del servidor", 
            error: error.message
        });
    }
}

module.exports = { 
    getSettlementCurrency,
    getPaymentType,
    getDeductionType,
    getPercentageByProject,
    getStatusSettlement,
    getPrePaymentDeductions,
    setPrePaymentDeductions,
    deletePrePaymentDeduction
}