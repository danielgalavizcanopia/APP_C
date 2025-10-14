const { getCatalogs } = require('../../queries/catalogs');

function getbiodiversity(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_biodiversity');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function geths(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_hs');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getHumanRights(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_humanrights');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getIndigenousPeople(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_indigenouspeople');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getLeadSafeGuards(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_leadsafeguards');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getNegativeHS(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_negativeehs');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('tb_proyectos');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getSafeguardNHapproach(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_safeguardsnoharmapproach');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getShareHoldersEngagement(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_shareholdersengagement');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getSocialCommunityNH(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_socialcommunitynoharm');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
            
        }
    });
}

function getStatusSafeguard(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_statussafeguards');
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
    getbiodiversity,
    geths,
    getHumanRights,
    getIndigenousPeople,
    getLeadSafeGuards,
    getNegativeHS,
    getProjects,
    getSafeguardNHapproach,
    getShareHoldersEngagement,
    getSocialCommunityNH,
    getStatusSafeguard,
}