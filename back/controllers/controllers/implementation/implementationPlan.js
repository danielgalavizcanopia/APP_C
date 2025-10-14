const { ejecutarStoredProcedure } = require('../../queries/projects')
const { getCatalogs } = require('../../queries/catalogs'); 
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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

async function setActivitiesData(req, res) {
    let IDUser = await catchUserLogged(req);
    const body = JSON.parse(req.body.body)
    let filePath

    if(!req.file){
        if(body && body.p_linkdelarchivo) filePath = body.p_linkdelarchivo
    } else {
        filePath = req.file ? path.posix.join('media/implementation', path.basename(req.file.path)) : null;
        if(body && body?.p_linkdelarchivo) await deleteDocument(path.posix.join(body.p_linkdelarchivo));
    }

    try {
        const resultados = await ejecutarStoredProcedure('sp_setActividadData', [
            body.p_IdActividaddata,
            body.p_idprojects,
            body.p_idactivitiesprojects,
            body.p_idrpnumber,
            body.p_objetivo,
            body.p_Idsop,
            body.p_fechaPeriodostart.split('T')[0],
            body.p_fechaPeriodoend.split('T')[0],
            body.p_Estimado,
            body.p_Ca_o_pex,
            body.p_idopexsubaccount,
            body.p_idcapexsubaccount,
            body.p_Cualitativos,
            filePath,
            body.p_UserEjecutordeCampo,
            body.p_IDUserCoordinador,
            body.p_IDUserSeguimiento,
            body.p_UserSupervisor,
            body.p_IDUserEvaluador,
            IDUser.IDUser,
            body.p_IdActividaddata ? IDUser.IDUser : 0,
            body.p_status 
        ]);
        if (resultados.length > 0) {

            let idActivityData = resultados[0][0]?.IdActividaddata
            if(body.p_status == 1){
                /** FOR PARA GUARDAR ODS */
                for(let i=0; i < body.ods.length; i++){
                    let odsRow = body.ods[i]
                    const ods = await ejecutarStoredProcedure('sp_setActividadRelOdss', [
                        odsRow.p_Idactividad_rel_odss,
                        body.p_IdActividaddata ? body.p_IdActividaddata : idActivityData,
                        odsRow.p_Idglobalgoals,
                        odsRow.p_Status,
                    ]);
                    if(ods.length > 0){
                        if(i + 1 == body.ods.length){
                            // res.status(200).json({valido: 1, result: resultados[0]});
                        }
                    }
                }

                /** FOR PARA GUARDAR INDICDORES */
                for(let i=0; i < body.indicadores.length; i++){
                    let indrow = body.indicadores[i]
                    const indicadores = await ejecutarStoredProcedure('sp_setIndicadoresCuantitativos', [indrow.idactividadrel ? indrow.idactividadrel: 0 ,body.p_IdActividaddata ? body.p_IdActividaddata : idActivityData, indrow.indicadorId, indrow.cantidad, 0, indrow.metrica, 1]);
                    if(indicadores.length > 0){
                        if(i + 1 == body.indicadores.length){
                            // res.status(200).json({valido: 1, result: resultados[0]});
                        }
                    }
                }
    
                /** FOR PARA GUARDAR REPORTEO */
                for(let repo=0; repo < body.reporteo.length; repo++){
                    let reprow = body.reporteo[repo]
                    const reporteos = await ejecutarStoredProcedure('sp_setActividadReporting', [reprow.Idactividadreporting ? reprow.Idactividadreporting : 0, body.p_IdActividaddata ? body.p_IdActividaddata : idActivityData, reprow.quien, reprow.como, reprow.cuando.split('T')[0], 1]);
                    if(reporteos.length > 0){
                        if(repo + 1 == body.reporteo.length){
                            res.status(200).json({valido: 1, result: resultados[0], message: "activity save succesfully"});
                        }
                    }
                }
            } else {
                res.status(200).json({valido: 1, result: resultados[0]});
            }

        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

function deleteIndicador(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const indicadores = await ejecutarStoredProcedure('sp_setIndicadoresCuantitativos', [req.body.p_Idactividadrelcuantitativo, req.body.p_IdActividaddata, req.body.p_Idcuantitativo, req.body.p_estimado, 0, req.body.p_Idmetrica, 0]);
            if(indicadores.length > 0){
                res.status(200).json({valido: 1, result: indicadores[0]});
            }
        } catch (error) {
            // console.log(error)
        }
    })
}

function deleteReporting(req, res){
    return new Promise(async function(resolve, reject){


        try {
            const reporteos = await ejecutarStoredProcedure('sp_setActividadReporting', [req.body.p_Idactividadreporting, req.body.p_IdActividaddata, req.body.p_ReportingQuien, req.body.p_ReportingComo, req.body.p_ReportingCuando.split('T')[0], 0]);
            if(reporteos.length > 0){
                res.status(200).json({valido: 1, result: reporteos[0]});
            }
        } catch (error) {
            // console.log(error)
        }        
    })
    
}


async function getActivitiesData(req, res){
      try {
        const resultados = await ejecutarStoredProcedure('sp_Getactividaddataandcts', [req.params.id]);
        if(resultados[0].length > 0){
          const actividades = resultados[0];
          let CapexPrincipalAccounts = [];
          let OpexPrincipalAccounts = [];

          let CapexActivities = [];
          let OpexActivities = [];

          let indexcapex = 1;
          let indexopex = 1;

          const resCapex = await getCatalogs('ct_capex_accounts');
          if(resCapex.length > 0){
            CapexPrincipalAccounts = resCapex;
          }
    
          const resOpex = await getCatalogs('ct_opex_accounts');
          if(resCapex.length > 0){
            OpexPrincipalAccounts = resOpex;
          }

          /** ARMADO CAPEX */
          for(const Capex of CapexPrincipalAccounts){
            let totalCuentasPrincipales = 0;
            Capex.subaccounts = [];
            for(const sub of actividades){
              if(sub.idcapexaccounts == Capex.idcapexaccounts && sub.Ca_o_pex == 1){
                Capex.subaccounts.push(sub);
                totalCuentasPrincipales += sub.EstimadoUSD;
              }
            }
            CapexActivities.push({
              id: indexcapex++,
              AccountName: Capex.concepto,
              total: totalCuentasPrincipales,
              subaccounts: Capex.subaccounts,
            });
          }

          /** ARMADO OPEX */
          for(const Opex of OpexPrincipalAccounts){
            let totalCuentasPrincipales = 0;

            Opex.subaccounts = [];
            for(const sub of actividades){
              if(sub.idopexaccounts == Opex.idopexaccounts && sub.Ca_o_pex == 2){
                Opex.subaccounts.push(sub);
                totalCuentasPrincipales += sub.EstimadoUSD;
              }
            }
            OpexActivities.push({
              id: indexopex++,
              AccountName: Opex.concepto,
              total: totalCuentasPrincipales,
              subaccounts: Opex.subaccounts,

            });

          }

          const resultado = [...CapexActivities, ...OpexActivities]

          res.status(201).json({valido: 1, result: resultado});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
} 


// Función para obtener los parámetros del stored procedure
const getValidationParams = (body, userId) => [
  body.Idvalidacion,
  body.IdActividaddata,
  body.IdstatusValidacion,
  new Date().toISOString().split('T')[0],
  userId,
];

// Función para decidir si hacer backup
const shouldBackup = (statusId) => statusId === 4;

// Función para manejar la respuesta final
const handleResponse = (res) => ({
  success: (result) => res.status(200).json({ valido: 1, result }),
  notFound: () => res.status(404).json({ message: "No data found for the given project ID." }),
  backupError: () => res.status(500).json({ message: "An error occurred while processing your validation." }),
  serverError: () => res.status(500).json({ message: "An error occurred while processing your request." }),
});

// Función principal (handler)
async function setValidaciones(req, res) {
  const respond = handleResponse(res);

  try {
    const IDUser = await catchUserLogged(req);
    const params = getValidationParams(req.body, IDUser.IDUser);

    const resultados = await ejecutarStoredProcedure('sp_setValidacionesbyID', params);
    if(resultados.length > 0) {
      res.status(200).json({valido: 1, result: resultados[0][0]});
    }

  } catch (error) {
    console.error('Error en setValidaciones:', error);
    return respond.serverError();
  }
}




async function setUsuariosName(req, res) {

    try {
        const resultados = await ejecutarStoredProcedure('sp_setusuariosname', [
            req.body.Idusuariosname,
            req.body.Name, 
            req.body.Status, 
            req.body.id_positions
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setCuantitativos(req, res) {

    try {
        const resultados = await ejecutarStoredProcedure('sp_setCuantitativos', [
            req.body.p_Idcuantitativo,
            req.body.p_nombre,
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}


async function setPlanAnnual(req, res) {
    let IDUser = await catchUserLogged(req);

    try {
        const resultadosPadi = await ejecutarStoredProcedure('sp_setPlanAnual', [
            req.body.p_Idplananual,
            req.body.p_name,
            req.body.p_idrpnumber,
            req.body.p_description,
            req.body.p_Observaciones,
            req.body.p_status,
            req.body.p_idprojects,
            IDUser.IDUser,
            req.body.p_Idplananual != 0 ? IDUser.IDUser : 0
        ]);
        if (resultadosPadi.length > 0) {
            let idPlanAnnual = resultadosPadi[0][0].Idplananual;
            let activities = req.body.activities
            let order = 1;
            for(let i=0; i < activities.length; i++){
                let activity = activities[i];

                /**
                 * para crear un padi, estas las mando por defecto en 1
                 * si las edito, puede venir 1 o 0 según lo que elija el usuario
                 * 
                 * si creo 
                 */

                const resultados = await ejecutarStoredProcedure('sp_setActividad_Rel_PlanAnual', [
                    activity.Idactividad_Rel_PlanAnual  ? activity.Idactividad_Rel_PlanAnual  : 0,
                    activity.Idplananual ? activity.Idplananual : idPlanAnnual,
                    activity.IdActividaddata,
                    order,
                    IDUser.IDUser,
                    req.body.p_Idplananual != 0 ? activity.status : 1
                    // activity.Idactividad_Rel_PlanAnual ? 1 : activity.status,
                ]);
                if(i + 1 == activities.length){
                    res.status(200).json({valido: 1, result: resultadosPadi[0], idPlanAnnual: idPlanAnnual});
                }
                order++;
            }

        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

function getPlanAnualByProject(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getPlanAnualByProject',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getPlanAnualById(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetPlanAnualByIdplananual',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {

      }
    });
}

function getActividadesByPlanAnual(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getActividadesByPlanAnual',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getActividadesWithoutPlanAnual(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetActNoPlanbyProjectRP',[req.params.id,req.params.idrpnumber,req.params.idplan]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}
 
function getIndicadoresCuantitativosByActividad(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetcuantitativosByActividaddata',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getOdsByActividad(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getActividadRelOds',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getReporteoByActividad(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetActividadReportingByActividad',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getPlanAnualHistorico(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getPlanAnualByProjecthist',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getActividadesByPlanAnualHistorico(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getActividadesByPlanAnualhist',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getIndicadoresCuantitativosByActividadHistorico(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getIndicadoresByActividadHist',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function getReportingByActividadHistorico(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_getReportingByActividadHist',[req.params.id]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function setDeleteAnnualPlanById(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_DeletePlanAnual',[req.body.Idplananual]);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados[0]});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
}

function deleteDocument(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}




  

module.exports = {
    setActivitiesData,
    getActivitiesData,
    setValidaciones,
    setUsuariosName,
    setCuantitativos,
    deleteIndicador,
    deleteReporting,
    setPlanAnnual,
    getPlanAnualByProject,
    getActividadesByPlanAnual,
    getActividadesWithoutPlanAnual,
    getPlanAnualById,
    getIndicadoresCuantitativosByActividad,
    getOdsByActividad,
    getReporteoByActividad,
    setDeleteAnnualPlanById,


    /** HISTORICOS */
    getPlanAnualHistorico,
    getActividadesByPlanAnualHistorico,
    getIndicadoresCuantitativosByActividadHistorico,
    getReportingByActividadHistorico
}