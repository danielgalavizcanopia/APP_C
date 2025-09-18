const { ejecutarStoredProcedure } = require('../../queries/projects');
const { ejecutarVistaTools } = require('../../queries/executeViews')
const { getCatalogs } = require('../../queries/catalogs');

function getprojectOverview(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashOverviewbyproject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getSummaryByActivitiesTracker(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('DashTotalBudgetTrackerbyproject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getSummaryBenefitTracker(req, res){
    return new Promise(async function (resolve, reject){
        try {
            let typeSupplierCt = [];
            let typeBenefitCt = [];

            const typeBenefit = await getCatalogs('ct_TypeofBeneficiary');
            if(typeBenefit.length > 0){
              typeBenefitCt = typeBenefit;
            }
            const typeSupplier = await getCatalogs('ct_typeofsupplier');
            if(typeSupplier.length > 0){
              typeSupplierCt = typeSupplier;
            }

            let Planned = [];
            let Paid = [];

            const summaryPlanned = await ejecutarStoredProcedure('dashSummaryPlannedbyproject', [req.params.id]);
            if(summaryPlanned.length > 0){
                Planned = summaryPlanned[0];
            }

            const summaryPaidBenefit = await ejecutarStoredProcedure('dashSummaryTypeBenefByproject', [req.params.id]);
            if(summaryPaidBenefit.length > 0){
                Paid = summaryPaidBenefit[0];
            }
            
            if(Planned.length > 0 && Paid.length > 0){
                var BenefitsRow = [];
                for(let i=0;i<typeBenefitCt.length;i++){
                    let ben = typeBenefitCt[i];
                    var supplierRow = [];
                    for(let j=0;j<typeSupplierCt.length;j++){
                        let supplier = typeSupplierCt[j];
                        var Rows = [];
                        totalPlanned = 0;
                        total = 0;
                        if(supplier.Status == ben.IdtypeofBeneficiary){
                            for(let x=0;x<Paid.length;x++) {
                                let RowPaid = Paid[x];
                                if(RowPaid.IdtypeofSupplier == supplier.IdtypeofSupplier){
                                    let plannedRow
                                    if(RowPaid.idcapexsubaccount){
                                        plannedRow = Planned.find(x => x.Ca_o_pex == 1 && x.idcapexsubaccount == RowPaid.idcapexsubaccount);
                                    }
                                    if(RowPaid.idopexsubaccount){
                                        plannedRow = Planned.find(x => x.Ca_o_pex == 2 && x.idopexsubaccount == RowPaid.idopexsubaccount);
                                    }
                                    Rows.push({
                                        id: x+1,
                                        Type: RowPaid.Type_of_Supplier,
                                        concept: RowPaid.Concept ? RowPaid.Concept : RowPaid.OpexConcept,
                                        planned: plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, // 0,
                                        paid: RowPaid.Amount_USD,
                                    })
                                    totalPlanned +=  plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, //0
                                    total += RowPaid.Amount_USD
                                }
                            }
                            const variancePercent = (Math.abs(totalPlanned - total) / ((totalPlanned + total) / 2)) * 100;
                            supplierRow.push({
                                id:j+1,
                                name: supplier.ShortDescription,
                                totalPlanned: totalPlanned,
                                totalPaid: total,
                                variance: variancePercent,
                                rows: Rows,
                            })
                        }
                        
                    }
                    let sumaTotalPlanned = 0;
                    let sumaTotal = 0;
                    let totaltopercentage = 0;
                    for(let sum of supplierRow){
                      sumaTotalPlanned += sum.totalPlanned;
                      sumaTotal += sum.totalPaid;
                    }

                    for(let totalSumPaid of Paid){
                        totaltopercentage += totalSumPaid.Amount_USD;
                    }
                    
                    const variancePercent = (Math.abs(sumaTotalPlanned - sumaTotal) / ((sumaTotalPlanned + sumaTotal) / 2)) * 100;
                    const percentByBeneficiary = (sumaTotal / totaltopercentage) * 100;
                    BenefitsRow.push({
                      id: i+1,
                      name: ben.ShortDescription,
                      totalPlanned: sumaTotalPlanned,
                      totalPaid: sumaTotal,
                      variance: variancePercent,
                      percentage: percentByBeneficiary,
                      rows: supplierRow,
                    });
                    
                }

                res.status(201).json({valido: 1, result: BenefitsRow});

            } else {
                res.status(200).json({valido: 0, message: "No results avaiable"});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getTopODSByProject(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashTopODSsByProject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getIncidenceByProject(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashIncidencebyproject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getActivitiesByOds(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashActivitiesbyODS', [req.params.id, req.params.idods]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getActivityDetailByOdsAndProject(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashActivityDetailByOdsAndProject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getKPIActivitiesByActivity(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashKPIbyActivities', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getActivitiesByProject(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashctActivitiesbyproject', [req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}



function getMacroProcessCatalog(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarVistaTools('vw_macroprocess');
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});

            }
        } catch (error) {
            console.log(error)
        }
    })
}


function getKeyMilestonesByMacroprocess(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashkeymilestone', [req.params.idp, req.params.idm]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function getCountEvidencesNIncidences(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('dashCountInciEvibyproject',[req.params.id]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}

async function getStatusProject(req, res){
    try {
        const statusByProject = await getCatalogs('ct_statusProject');
        if(statusByProject.length > 0){
            res.status(200).json({valido: 1, result: statusByProject});
        }
    } catch (error) {
        
    }
}

function setProjectStatus(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const body = req.body;
            const resultados = await ejecutarStoredProcedure('sp_SetProjectStatus',[
                body.idprojects,
                body.IdpstatusProject
            ]);
            if(resultados.length > 0){
                res.status(200).json({valido: 1, result: resultados[0]});
            }
        } catch (error) {
            console.log(error)
        }
    })
}
module.exports = {
    getprojectOverview,
    getSummaryByActivitiesTracker,
    getSummaryBenefitTracker,
    getTopODSByProject,
    getActivitiesByOds,
    getActivityDetailByOdsAndProject,
    getIncidenceByProject,
    getKPIActivitiesByActivity,
    getActivitiesByProject,
    getMacroProcessCatalog,
    getKeyMilestonesByMacroprocess,
    getCountEvidencesNIncidences,
    getStatusProject,
    setProjectStatus,
}