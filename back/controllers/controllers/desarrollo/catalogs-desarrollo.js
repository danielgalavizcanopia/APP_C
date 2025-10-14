const { getCatalogs } = require('../../queries/catalogs');


function getLicencesPermits(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_licensespermits');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getLeadDesarrollo(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_leadsdesarrollo');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getDevelopmentStatus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_developmentstatus');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getRegistry(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_programme');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMethodology(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_methodology');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getConfidenceoffrontcost(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_confidenceoffrontcost');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getCBAcalculatorversion(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_cbacalculatorversion');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getConfidenceofcreditingactivityarea(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_confidenceofcreditingactivityarea');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProjectcondition(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_projectcondition');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getERScalculatorversion(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_erscalculatorversion');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMercuriaddstatus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_mercuriaddstatus');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getEstimatepermanence(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_estimatepermanence');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {

        }
    });
}

function getEstimateleakeage(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_estimateleakeage');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {

        }
    });
}

function getEstimatedmrvrequirements(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_estimatedmrvrequirements');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {

        }
    });
}

function getRegistrationroute(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await getCatalogs('ct_registrationroute');
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
    getLicencesPermits,
    getLeadDesarrollo,
    getDevelopmentStatus,
    getRegistry,
    getMethodology,
    getConfidenceoffrontcost,
    getCBAcalculatorversion,
    getConfidenceofcreditingactivityarea,
    getProjectcondition,
    getERScalculatorversion,
    getMercuriaddstatus,
    getEstimatepermanence,
    getEstimateleakeage,
    getEstimatedmrvrequirements,
    getRegistrationroute
}