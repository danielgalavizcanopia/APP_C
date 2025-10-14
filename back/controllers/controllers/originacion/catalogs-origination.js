const { getCatalogs } = require('../../queries/catalogs');

function getImplementationPartner(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_implementationpartner');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getLandTernureType(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_landtenuretype');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProjectType(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_projecttype');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProgram(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_program');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOriginationLead(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_leadsoriginacion');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOriginationPromoter(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_originationpromoter');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getOriginationStatus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_originationstatus');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getApprovedBuyer(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_approvedbuyer');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProspectPriority(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_prospectpriority');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProjectAlive(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_projectalive');
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
    getImplementationPartner,
    getLandTernureType,
    getProjectType,
    getProgram,
    getOriginationLead,
    getOriginationPromoter,
    getOriginationStatus,
    getApprovedBuyer,
    getProspectPriority,
    getProjectAlive,
}