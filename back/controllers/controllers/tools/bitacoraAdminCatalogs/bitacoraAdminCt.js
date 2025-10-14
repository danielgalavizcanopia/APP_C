const { ejecutarStoredProcedure } = require('../../../queries/catalogs');

function getHitoProcess(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetHitoProceso',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function setHitoProcess(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_SetHitoProceso',[req.body.IdhitoProceso, req.body.ShortDescription, req.body.LargeDescription, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getCategories(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetCategorias',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function setCategories(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_SetCategorias',[req.body.Id_CategoriaEvidencia, req.body.ShortDescription, req.body.LargeDescription, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getEvidences(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_getEvidences',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function setEvidences(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_SetEvidences',[req.body.IDTipoEvidencia, req.body.ShortDescription, req.body.LargeDescription, req.body.status]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}



function setCatRelationship(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_SETHitoCatEviOnStatus',[req.body.status, req.body.IdhitoProceso, req.body.IdCategoriaEvidencia, req.body.IDTipoEvidencia]);
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
    getHitoProcess,
    setHitoProcess,
    getCategories,
    setCategories,
    getEvidences,
    setEvidences,
    setCatRelationship
}