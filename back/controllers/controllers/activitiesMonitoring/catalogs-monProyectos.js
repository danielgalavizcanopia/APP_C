const express = require('express');
const jwt = require('jsonwebtoken');
const { ejecutarStoredProcedure } = require('../../queries/projects')
const { getCatalogs } = require('../../queries/catalogs');

/** FUNCTIONS */

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

function getTypeActivities(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_typeactivities');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getMetricas(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_metricas');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getActivitiesProjects(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_activities_projects');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getActivitiesStatus(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusdesarrollo');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getCuentasCapex(req, res){
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

function getSubCuentasCapex(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_capex_subaccount');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function getCuentasOpex(req, res){
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


function getActividadesByProject(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarStoredProcedure('sp_getActividadesByProject_Rp', [req.params.rpnumber, req.params.idprojects]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}


function getStatusReporteoActividades(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            
            const resultados = await getCatalogs('ct_statusreporteoactividades');
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}
/** MODULE EXPORTS */
module.exports = {
    getLeadDesarrollo,
    getTypeActivities,
    getMetricas,
    getActivitiesProjects,
    getActivitiesStatus,
    getCuentasCapex,
    getSubCuentasCapex,
    getCuentasOpex,

    getActividadesByProject,
    getStatusReporteoActividades
}