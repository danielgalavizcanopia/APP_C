const { getCatalogs } = require('../../queries/catalogs');


/** Area de proyecto */
function getCertificacion(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_certificacion');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCtRAN(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_solicitudalran');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getctlead(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_leadsig');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getctstatusvalidnap(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusvalidacionap');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


/** Area de Actividad */
function getversionAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_versionaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getStatusValidacionAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusvalidacionaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

/** PED */

function getResultadopedAP(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_resultadopedap');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getseccionAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_seccionpedaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getPoblacionAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_poblacionaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getActividadAgropecuaria(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_actividadagropecuaria');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getEncuestas(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_encuestas');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getSubsidios(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_subsidiosaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getPendienteAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_pendienteaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCambioCobertura(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_cambiocoberturaaa');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getResultadopedAA(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_resultadopedaa');
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
    /**AREA DE PROYECTO */
    getCertificacion,
    getCtRAN,
    getctlead,
    getctstatusvalidnap,
    /**AREA DE ACTIVIDAD */
    getversionAA,
    getStatusValidacionAA,
    /** PED */
    getResultadopedAP,
    getseccionAA,
    getPoblacionAA,
    getActividadAgropecuaria,
    getEncuestas,
    getSubsidios,
    getPendienteAA,
    getCambioCobertura,
    getResultadopedAA,
}