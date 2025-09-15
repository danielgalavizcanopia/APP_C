const { ejecutarStoredProcedure } = require('../../queries/catalogs')
const { ejecutarVistaTools } = require('../../queries/executeViews')
const { getCatalogs } = require('../../queries/catalogs');

function getCapexAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_capex_accounts');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getCapexSubaccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            // vw_capex_subaccount
            const resultados = await ejecutarVistaTools('vw_capexsub_and_account',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            console.log(error)
        }
    });
}

function setCapexAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_setCapexAccounts',[req.body.idcapexaccounts, req.body.cuentacompaq, req.body.concepto, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            console.log(error);
            
        }
    });
}
function setCapexSubaccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_setCapexSubaccounts',[req.body.idcapexsubaccount, req.body.cuentacompaq, req.body.concepto, req.body.idcapexaccounts, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOpexAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_opex_accounts');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
function getOpexSubaccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarVistaTools('vw_opexsub_and_account',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function setOpexAccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_setOpexAccounts',[req.body.idopexaccounts, req.body.cuentacompaq, req.body.concepto, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            console.log(error);
        }
    });
}
function setOpexSubaccounts(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_setOpexSubaccounts',[req.body.idopexsubaccount, req.body.cuentacompaq, req.body.concepto, req.body.idopexaccounts, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getCapexAccounts,
    getCapexSubaccounts,
    setCapexAccounts,
    setCapexSubaccounts,

    getOpexAccounts,
    getOpexSubaccounts,
    setOpexAccounts,
    setOpexSubaccounts
}