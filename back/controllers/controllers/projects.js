const express = require('express');
const jwt = require('jsonwebtoken');
const { ejecutarStoredProcedure } = require('../queries/projects')

/** CAPTURA USUARIO LOGUEADO PARA ENVIARLO EN LAS DEMÁS FUNCIONES */
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

function getProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GETProyectos', []);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, projects: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function insertProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            /** FUNCIÓN PARA OBTENER USUARIO LOGUEADO Y AGREGARLO A LOS SP */
            let IDUser = await catchUserLogged(req);

            const resultados = await ejecutarStoredProcedure('sp_SETproyectos', [req.body.ProjectName, req.body.idaggregation, req.body.Counterpart, req.body.idnucleoAgrario, IDUser.IDUser]);
            if(resultados[0][0].result == 1 || resultados[0][0].message == 'valido'){
                res.status(201).json({valido: 1, message: "Se guardó correctamente"});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function updateProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            let IDUser = await catchUserLogged(req);

            const resultados = await ejecutarStoredProcedure('sp_UPDATEProyectos_and_UPDATEProyectoHist', [parseInt(req.params.id), req.body.ProjectName, req.body.idaggregation, req.body.Counterpart, req.body.idnucleoAgrario, IDUser.IDUser, req.body.status, IDUser.IDUser]);
            if(resultados[0][0].Resultado){
                res.status(201).json({valido: 1, message: "Se ejecutó la actualización correctamente correctamente"});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getProjectDetailById(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetProyectoHistByID', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, project: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMunStateByAgrarianCore(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('sp_GetNucleoagrarioByID', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, project: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


/** HISTORICO PROYECTOS */
function insertHistoricProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            /** FUNCIÓN PARA OBTENER USUARIO LOGUEADO Y AGREGARLO A LOS SP */
            let IDUser = await catchUserLogged(req);

            const resultados = await ejecutarStoredProcedure('sp_SETProyectoHist', [req.body.idproyectohist,req.body.idprojects, req.body.ProjectName, req.body.idaggregation, req.body.Counterpart, req.body.idnucleoAgrario, req.body.Justification, IDUser.IDUser]);
            if (resultados && resultados.length > 0) {
                const resultado = resultados[0][0]; // Primer resultado del primer conjunto de resultados
                if (resultado.message === 'INSERT') {
                    res.status(201).json({message: "Se guardo correctamente" });
                    
                } else if (resultado.message === 'UPDATE') {
                    res.status(201).json({message: "Se actualizo correctamente" });
                }
                else {
                    res.status(400).json({ error: "No se guardó correctamente" });
                }
            } else {
                res.status(400).json({ error: "No se guardó correctamente" });
            }
        } catch (error) {
            reject(error);
        }
    });
}

function DeclineUpdateProject(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            /** FUNCIÓN PARA OBTENER USUARIO LOGUEADO Y AGREGARLO A LOS SP */
            let IDUser = await catchUserLogged(req);

            const resultados = await ejecutarStoredProcedure('DeclineUpdateProject', [req.body.idproyectohist, req.body.idprojects, IDUser.IDUser]);
            if (resultados && resultados.length > 0) {
                const resultado = resultados[0][0]; // Primer resultado del primer conjunto de resultados
                if (resultado.message === 'Rechazado') {
                    res.status(201).json({message: "Se rechazó actualización correctamente" });
                    
                } else {
                    res.status(400).json({ error: "No se ejecutó la instrucción correctamente" });
                }
            } else {
                res.status(400).json({ error: "No se guardó correctamente" });
            }
        } catch (error) {
            reject(error);
        }
    });
}

function getProjectDetailHist(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await ejecutarStoredProcedure('GetRequestsDetails', [req.params.id]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, project: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getProjects,
    insertProjects,
    updateProjects,
    getProjectDetailById,
    getMunStateByAgrarianCore,
    insertHistoricProjects,
    DeclineUpdateProject,
    getProjectDetailHist,
}