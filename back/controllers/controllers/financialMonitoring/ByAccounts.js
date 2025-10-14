const { ejecutarStoredProcedure } = require('../../queries/projects');
const { ejecutarVistaTools } = require('../../queries/executeViews')

const { getCatalogs } = require('../../queries/catalogs'); 
const { getSharepointRegisters } = require('./Sharepoint');
const ExcelJS = require('exceljs');

const dotenv = require("dotenv");
dotenv.config();

/** REDIS IMPORT */
const { redisClient } = require('../../config/redisConfig');


async function getByAccountsReport(req, res){
      try {
        
        /** GENERAMOS CLAVE REDIS PARA CONSULTAR CACHE */
        const cacheKey = `${process.env.ENVIRONMENT}-ByAccountsReport-${parseInt(req.params.idprojects)}-${req.params.rpnumber}`;

        /** SE HACE LA CONSULTA DE CACHÉ, SI ENCUENTRA ALGO, ENTONCES ES LO QUE REGRESARÁ SIN NECESIDAD DE HACER TODO EL FLUJO */
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          console.log('📦 Data desde Redis');
          return res.status(200).json({ valido: 1, result: JSON.parse(cachedData) });
        }

        let Accounts = [];
  
        let CapexPlanned = [];
        let plannedAssembly = [];
        let CapexPrincipalAccounts = [];
        let OpexPrincipalAccounts = [];
  
        let CapexSnd
        let OpexSnd
  
        let OpexPaid
        let lastDate;
  
        const FinancialAccounts = await ejecutarStoredProcedure('sp_GetCuentsActivitiesbyprojectandRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(FinancialAccounts){
          Accounts = FinancialAccounts[0];
        }
  
        const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
        if(capexSigned){
          CapexSnd = capexSigned[0][0];
        }
        
        const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
        if(opexSigned){
          OpexSnd = opexSigned[0][0];
        }
  
        const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(opexPaid){
          OpexPaid = opexPaid[0];
        }
  
        const capexplanned = await ejecutarStoredProcedure('sp_GetPlannedActividadbyProjectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(capexplanned){
          CapexPlanned = capexplanned[0];
        }

        const plannedByAssembly = await ejecutarStoredProcedure('sp_getPlannedByAssembly',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(plannedByAssembly){
          plannedAssembly = plannedByAssembly[0];
        }
  
        const resCapex = await getCatalogs('ct_capex_accounts');
        if(resCapex.length > 0){
          CapexPrincipalAccounts = resCapex;
        }
  
        const resOpex = await getCatalogs('ct_opex_accounts');
        if(resCapex.length > 0){
          OpexPrincipalAccounts = resOpex;
        }

        const getLastDate = await ejecutarVistaTools('vw_dateprovisional'); /** OBTENEMOS LA ULTIMA FECHA DEL LEDGER CARGADO */
        if(getLastDate.length > 0){
          lastDate = getLastDate[0];
        }

        const FolioProject = CapexSnd ? CapexSnd.Folio_Project : null;
        let SharepointInitialRows = []
        if(FolioProject){
          SharepointInitialRows = await getSharepointRegisters(FolioProject);
        } else {
          SharepointInitialRows = [];
        }
        
        const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
        const diaDespues = new Date(diaLedged);
        diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
        const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
        const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
        /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
        const SharepointFinalRows = SharepointInitialRows.filter(registro => {
          return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
        });
        
        let CapexAccounts = [];
        let OpexAccounts = [];
  
        let totalAssemblyCapex = 0;
        let totalPlannedCapex = 0;
        let totalAssemblyOpex = 0;
        let totalPlannedOpex = 0;
  
        let totalPaidCapex = 0;
        let totalPaidOpex = 0;

        let totalProvisionalCapex = 0;
        let totalProvisionalOpex = 0;
  
        let FinalAccounts = [];
  
        let indexcapex = 1;
        let indexopex = 1;
  
        /** ARMADO DE ARRAY CAPEX */
        for(let capexAccount of CapexPrincipalAccounts){
          var subAccounts = [];
          var totalPlanned = 0;
          var totalPaid = 0;
          var totalProvisional = 0;
  
          for(let account of Accounts){
            if(account.idcapexsubaccount){
              if(capexAccount.idcapexaccounts == account.IDCapexprincipal){
                let capexplan;
                capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber && x.idactivitiesprojects == account.idactivitiesprojects)
                let shareMonto = 0;
                let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)
                if(provisionalRow.length > 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }

                const existingDuplicate = subAccounts.find(x => x.idActividaddata === capexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idcapexaccount === account.idcapexsubaccount);
                if(existingDuplicate){
                  capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
                }


                subAccounts.push({
                    idActividaddata: capexplan?.IdActividaddata ,
                    Name:  capexplan ? capexplan.Actividad : '',
                    idactivitiesprojects: account.idactivitiesprojects,
                    account: account.capexconcepto,
                    accountWA: account.subcuentacapex,
                    idcapexaccount: account.idcapexsubaccount,
                    idrpnumber: account.idrpnumber,
                    planned:  capexplan ? parseFloat(capexplan.EstimadoUSD) : 0,
                    paid: account.Presupuesto_Pagado,
                    provisional: shareMonto,
                });

                totalPlanned += capexplan ? parseFloat(capexplan.EstimadoUSD) : 0
                totalPaid += account.Presupuesto_Pagado
                totalProvisional += shareMonto;
                
              }
            }
          }
  
          for(let plannedAccount of CapexPlanned){
            if(capexAccount.idcapexaccounts == plannedAccount.IDCapexprincipal){
              if(plannedAccount.Ca_o_pex == 1){
                  let capexPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idcapexaccount == plannedAccount.idcapexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                  if(!capexPaid){
                    subAccounts.push({
                      Name: plannedAccount.Actividad,
                      idactivitiesprojects: plannedAccount.idactivitiesprojects,
                      idcapexaccount: plannedAccount.idcapexsubaccount,
                      idrpnumber: plannedAccount.idrpnumber,
                      account: plannedAccount.subcuentacapex,
                      planned: plannedAccount.EstimadoUSD,
                      paid: 0,
                      provisional: 0,
                    });
                    totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                  } else {
                    // console.log(capexPaid, 'cpxPaid');
                  }
              }
            }
          }
  
          CapexAccounts.push({
            id: indexcapex++,
            AccountName: capexAccount.concepto,
            Planned: totalPlanned,
            Paid: totalPaid,
            Provisional: totalProvisional,
            subAccounts: subAccounts
          });
  
          totalPlannedCapex += totalPlanned
          totalPaidCapex += totalPaid
          totalProvisionalCapex += totalProvisional
        }
  
              /** ARMADO DE ARRAY OPEX */
        for(let opexAccount of OpexPrincipalAccounts){
          var subAccounts = [];
          var totalPlanned = 0;
          var totalPaid = 0;
          var totalProvisional = 0;
          
          for(let account of OpexPaid){
            if(account.idopexsubaccount){
              if(opexAccount.idopexaccounts == account.idopexaccounts){
                let opexplan;
                opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects)
                let shareMonto = 0;
                let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)
                if(provisionalRow.length >= 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }
                
                const existingDuplicate = subAccounts.find(x => x.idActividaddata === opexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idopexaccount === account.idopexsubaccount);
                if(existingDuplicate){
                  opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
                }

                subAccounts.push({
                    idActividaddata: opexplan?.IdActividaddata ,
                    Name:  opexplan ? opexplan.Actividad : '',
                    idactivitiesprojects: account.idactivitiesprojects,
                    account: account.opexconcepto,
                    accountWA: account.subcuentaopex,
                    idopexaccount: account.idopexsubaccount,
                    idrpnumber: account.idrpnumber,
                    planned:  opexplan ? parseFloat(opexplan.EstimadoUSD) : 0,
                    paid: account.Presupuesto_Pagado,
                    provisional: shareMonto,
                });

                totalPlanned += opexplan ? parseFloat(opexplan.EstimadoUSD) : 0
                totalPaid += account.Presupuesto_Pagado
                totalProvisional += shareMonto;
              }
            }
          }
  
          for(let plannedAccount of CapexPlanned){
            if(opexAccount.idopexaccounts == plannedAccount.IDOpexprincipal){
              if(plannedAccount.Ca_o_pex == 2){
                  let opxPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idopexaccount == plannedAccount.idopexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                  if(!opxPaid){
                    subAccounts.push({
                      Name: plannedAccount.Actividad || plannedAccount.NombreActividad,
                      idopexaccount: plannedAccount.idopexsubaccount,
                      idrpnumber: plannedAccount.idrpnumber,
                      account: plannedAccount.subcuentaopex,
                      planned: plannedAccount.EstimadoUSD,
                      paid: 0,
                      provisional: 0,
                    });
                    totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                  } 
                  
              }
            }
          }
  
          OpexAccounts.push({
            id: indexopex++,
            AccountName: opexAccount.concepto,
            Planned: totalPlanned,
            Paid: totalPaid,
            Provisional: totalProvisional,
            subAccounts: subAccounts
          });

          totalPlannedOpex += totalPlanned
          totalPaidOpex += totalPaid
          totalProvisionalOpex += totalProvisional

        }

        for(let assembly of plannedAssembly){
          if(assembly.Ca_o_pex == 1){
            totalAssemblyCapex += assembly.TotalEstimadoUSD
          } else if(assembly.Ca_o_pex == 2){
            totalAssemblyOpex += assembly.TotalEstimadoUSD
          }
        }

        FinalAccounts = [
          {
            id: 1,
            Name: 'Capex Accounts',
            Approved: CapexSnd?.total,
            Assembly: totalAssemblyCapex,
            Planned: totalPlannedCapex,
            Paid: totalPaidCapex,
            Provisional: totalProvisionalCapex,
            Accounts: CapexAccounts
          },
          {
            id: 2,
            Name: 'Opex Accounts',
            Approved: OpexSnd?.valor,
            Assembly: totalAssemblyOpex,
            Planned: totalPlannedOpex,
            Paid: totalPaidOpex,
            Provisional: totalProvisionalOpex,
            Accounts: OpexAccounts
          }
        ]

        await redisClient.set(cacheKey, JSON.stringify(FinalAccounts), { EX: 20 });
  
        res.status(201).json({valido: 1, result: FinalAccounts});
  
        
      } catch (error) {
        console.log(error);
      }
  
  }
  
  
function getByAccountsReportXLSX(req, res){
  return new Promise(async function (resolve, reject){
    let Accounts = [];

    let CapexPlanned = [];
    let CapexPrincipalAccounts = [];
    let OpexPrincipalAccounts = [];
    let plannedAssembly = []

    let CapexSnd
    let OpexSnd

    let OpexPaid
    let lastDate;


            const FinancialAccounts = await ejecutarStoredProcedure('sp_GetCuentsActivitiesbyprojectandRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(FinancialAccounts){
          Accounts = FinancialAccounts[0];
        }
  
        const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
        if(capexSigned){
          CapexSnd = capexSigned[0][0];
        }
        
        const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
        if(opexSigned){
          OpexSnd = opexSigned[0][0];
        }
  
        const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(opexPaid){
          OpexPaid = opexPaid[0];
        }
  
        const capexplanned = await ejecutarStoredProcedure('sp_GetPlannedActividadbyProjectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(capexplanned){
          CapexPlanned = capexplanned[0];
        }

        const plannedByAssembly = await ejecutarStoredProcedure('sp_getPlannedByAssembly',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(plannedByAssembly){
          plannedAssembly = plannedByAssembly[0];
        }
  
        const resCapex = await getCatalogs('ct_capex_accounts');
        if(resCapex.length > 0){
          CapexPrincipalAccounts = resCapex;
        }
  
        const resOpex = await getCatalogs('ct_opex_accounts');
        if(resCapex.length > 0){
          OpexPrincipalAccounts = resOpex;
        }

        const getLastDate = await ejecutarVistaTools('vw_dateprovisional'); /** OBTENEMOS LA ULTIMA FECHA DEL LEDGER CARGADO */
        if(getLastDate.length > 0){
          lastDate = getLastDate[0];
        }

        const FolioProject = CapexSnd ? CapexSnd.Folio_Project : null;
        let SharepointInitialRows = []
        if(FolioProject){
          SharepointInitialRows = await getSharepointRegisters(FolioProject);
        } else {
          SharepointInitialRows = [];
        }
        
        const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
        const diaDespues = new Date(diaLedged);
        diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
        const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
        const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
        /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
        const SharepointFinalRows = SharepointInitialRows.filter(registro => {
          return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
        });
        
        let CapexAccounts = [];
        let OpexAccounts = [];
  
        let totalAssemblyCapex = 0;
        let totalPlannedCapex = 0;
        let totalAssemblyOpex = 0;
        let totalPlannedOpex = 0;
  
        let totalPaidCapex = 0;
        let totalPaidOpex = 0;

        let totalProvisionalCapex = 0;
        let totalProvisionalOpex = 0;
  
        let FinalAccounts = [];
  
        let indexcapex = 1;
        let indexopex = 1;
  
        /** ARMADO DE ARRAY CAPEX */
        for(let capexAccount of CapexPrincipalAccounts){
          var subAccounts = [];
          var totalPlanned = 0;
          var totalPaid = 0;
          var totalProvisional = 0;
  
          for(let account of Accounts){
            if(account.idcapexsubaccount){
              if(capexAccount.idcapexaccounts == account.IDCapexprincipal){
                let capexplan;
                capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber && x.idactivitiesprojects == account.idactivitiesprojects)
                let shareMonto = 0;
                let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)
                if(provisionalRow.length > 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }

                const existingDuplicate = subAccounts.find(x => x.idActividaddata === capexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idcapexaccount === account.idcapexsubaccount);
                if(existingDuplicate){
                  capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
                }


                subAccounts.push({
                    idActividaddata: capexplan?.IdActividaddata ,
                    Name:  capexplan ? capexplan.Actividad : '',
                    idactivitiesprojects: account.idactivitiesprojects,
                    account: account.capexconcepto,
                    accountWA: account.subcuentacapex,
                    idcapexaccount: account.idcapexsubaccount,
                    idrpnumber: account.idrpnumber,
                    planned:  capexplan ? parseFloat(capexplan.EstimadoUSD) : 0,
                    paid: account.Presupuesto_Pagado,
                    provisional: shareMonto,
                });

                totalPlanned += capexplan ? parseFloat(capexplan.EstimadoUSD) : 0
                totalPaid += account.Presupuesto_Pagado
                totalProvisional += shareMonto;
                
              }
            }
          }
  
          for(let plannedAccount of CapexPlanned){
            if(capexAccount.idcapexaccounts == plannedAccount.IDCapexprincipal){
              if(plannedAccount.Ca_o_pex == 1){
                  let capexPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idcapexaccount == plannedAccount.idcapexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                  if(!capexPaid){
                    subAccounts.push({
                      Name: plannedAccount.Actividad,
                      idactivitiesprojects: plannedAccount.idactivitiesprojects,
                      idcapexaccount: plannedAccount.idcapexsubaccount,
                      idrpnumber: plannedAccount.idrpnumber,
                      account: plannedAccount.subcuentacapex,
                      planned: plannedAccount.EstimadoUSD,
                      paid: 0,
                      provisional: 0,
                    });
                    totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                  } else {
                    // console.log(capexPaid, 'cpxPaid');
                  }
              }
            }
          }
  
          CapexAccounts.push({
            id: indexcapex++,
            AccountName: capexAccount.concepto,
            Planned: totalPlanned,
            Paid: totalPaid,
            Provisional: totalProvisional,
            subAccounts: subAccounts
          });
  
          totalPlannedCapex += totalPlanned
          totalPaidCapex += totalPaid
          totalProvisionalCapex += totalProvisional
        }
  
              /** ARMADO DE ARRAY OPEX */
        for(let opexAccount of OpexPrincipalAccounts){
          var subAccounts = [];
          var totalPlanned = 0;
          var totalPaid = 0;
          var totalProvisional = 0;
          
          for(let account of OpexPaid){
            if(account.idopexsubaccount){
              if(opexAccount.idopexaccounts == account.idopexaccounts){
                let opexplan;
                opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects)
                let shareMonto = 0;
                let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)

                if(provisionalRow.length >= 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }
                
                const existingDuplicate = subAccounts.find(x => x.idActividaddata === opexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idopexaccount === account.idopexsubaccount);
                if(existingDuplicate){
                  opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
                }

                subAccounts.push({
                    idActividaddata: opexplan?.IdActividaddata ,
                    Name:  opexplan ? opexplan.Actividad : '',
                    idactivitiesprojects: account.idactivitiesprojects,
                    account: account.opexconcepto,
                    accountWA: account.subcuentaopex,
                    idopexaccount: account.idopexsubaccount,
                    idrpnumber: account.idrpnumber,
                    planned:  opexplan ? parseFloat(opexplan.EstimadoUSD) : 0,
                    paid: account.Presupuesto_Pagado,
                    provisional: shareMonto,
                });

                totalPlanned += opexplan ? parseFloat(opexplan.EstimadoUSD) : 0
                totalPaid += account.Presupuesto_Pagado
                totalProvisional += shareMonto;
              }
            }
          }
  
          for(let plannedAccount of CapexPlanned){
            if(opexAccount.idopexaccounts == plannedAccount.IDOpexprincipal){
              if(plannedAccount.Ca_o_pex == 2){
                  let opxPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idopexaccount == plannedAccount.idopexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                  if(!opxPaid){
                    subAccounts.push({
                      Name: plannedAccount.Actividad || plannedAccount.NombreActividad,
                      idopexaccount: plannedAccount.idopexsubaccount,
                      idrpnumber: plannedAccount.idrpnumber,
                      account: plannedAccount.subcuentaopex,
                      planned: plannedAccount.EstimadoUSD,
                      paid: 0,
                      provisional: 0,
                    });
                    totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                  } 
                  
              }
            }
          }
  
          OpexAccounts.push({
            id: indexopex++,
            AccountName: opexAccount.concepto,
            Planned: totalPlanned,
            Paid: totalPaid,
            Provisional: totalProvisional,
            subAccounts: subAccounts
          });

          totalPlannedOpex += totalPlanned
          totalPaidOpex += totalPaid
          totalProvisionalOpex += totalProvisional

        }

        for(let assembly of plannedAssembly){
          if(assembly.Ca_o_pex == 1){
            totalAssemblyCapex += assembly.TotalEstimadoUSD
          } else if(assembly.Ca_o_pex == 2){
            totalAssemblyOpex += assembly.TotalEstimadoUSD
          }
        }

        FinalAccounts = [
          {
            id: 1,
            Name: 'Capex Accounts',
            Approved: CapexSnd?.total,
            Assembly: totalAssemblyCapex,
            Planned: totalPlannedCapex,
            Paid: totalPaidCapex,
            Provisional: totalProvisionalCapex,
            Accounts: CapexAccounts
          },
          {
            id: 2,
            Name: 'Opex Accounts',
            Approved: OpexSnd?.valor,
            Assembly: totalAssemblyOpex,
            Planned: totalPlannedOpex,
            Paid: totalPaidOpex,
            Provisional: totalProvisionalOpex,
            Accounts: OpexAccounts
          }
        ]
        
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('By Account Tracker', {
        properties: { tabColor: { argb: 'FF0000' } }
        });

        sheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombre', key: 'Name', width: 15 },
            { header: 'Cuenta', key: 'AccountName', width: 42 },
            { header: 'Subcuenta', key: 'subAccountName', width: 55 },
            { header: 'RP', key: 'idrpnumber', width: 10 },
            // AQUI POSIBLEMENTE METERÍA EL RP DE LOS REGISTROS
            { header: 'Aprobado', key: 'Approved', width: 15, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Planeado por asamblea', key: 'Assembly', width: 25, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Planeado', key: 'plannedSub', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Pagado', key: 'paidSub', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Provisional', key: 'provisionalSub', width: 20, style: { numFmt: '"$"#,##0.00' } },
        ];

        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        function printSubAccounts(sheet, subAccounts, startRow) {
        let currentRow = startRow;

        subAccounts.forEach((subAccount) => {
            sheet.getRow(currentRow).getCell(4).value = subAccount.accountWA || subAccount.account;
            sheet.getRow(currentRow).getCell(5).value = subAccount.idrpnumber ? "RP" + subAccount.idrpnumber : '';
            sheet.getRow(currentRow).getCell(8).value = subAccount.planned;
            sheet.getRow(currentRow).getCell(9).value = subAccount.paid;
            sheet.getRow(currentRow).getCell(10).value = subAccount.provisional;
            currentRow++;
        });

        return currentRow;
        }

        function printAccounts(sheet, accounts, startRow) {
            let currentRow = startRow;

            accounts.forEach((account) => {
                sheet.getRow(currentRow).getCell(3).value = account.AccountName;
                sheet.getRow(currentRow).getCell(8).value = account.Planned;
                sheet.getRow(currentRow).getCell(9).value = account.Paid;
                sheet.getRow(currentRow).getCell(10).value = account.Provisional;

                /** ESTILOS */
                sheet.getRow(currentRow).getCell(7).font = { bold: true };
                sheet.getRow(currentRow).getCell(8).font = { bold: true };
                sheet.getRow(currentRow).getCell(9).font = { bold: true };


                if (account.subAccounts && account.subAccounts.length > 0) {
                currentRow = printSubAccounts(sheet, account.subAccounts, currentRow + 1);
                } else {
                currentRow++;
                }
            });

            return currentRow;
        }

        let currentRow = 2;
        FinalAccounts.forEach((item) => {
        const newRow = sheet.addRow({
            id: item.id,
            Name: item.Name,
            Approved: item.Approved,
            Assembly: item.Assembly,
            plannedSub: item.Planned,
            paidSub: item.Paid,
            provisionalSub: item.Provisional
        });

        newRow.getCell('Approved').numFmt = '$#,##0.00';

        newRow.getCell('Approved').font = { bold: true };
        if (item.Accounts && item.Accounts.length > 0) {
            currentRow = printAccounts(sheet, item.Accounts, currentRow + 1);
        } else {
            currentRow++;
        }
        });

        sheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4CAF50' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        });


        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

  });
}

async function getByAccountByFullReport(idProject, rpnumbers){
  try {
      let Accounts = [];

      let CapexPlanned = [];
      let CapexPrincipalAccounts = [];
      let OpexPrincipalAccounts = [];
      let plannedAssembly = []

      let CapexSnd
      let OpexSnd

      let OpexPaid
      let lastDate;

      const FinancialAccounts = await ejecutarStoredProcedure('sp_GetCuentsActivitiesbyprojectandRP',[parseInt(idProject), rpnumbers]);
      if(FinancialAccounts){
        Accounts = FinancialAccounts[0];
      }

      const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(idProject)]);
      if(capexSigned){
        CapexSnd = capexSigned[0][0];
      }
      
      const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[rpnumbers, parseInt(idProject)]);
      if(opexSigned){
        OpexSnd = opexSigned[0][0];
      }

      const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(idProject), rpnumbers]);
      if(opexPaid){
        OpexPaid = opexPaid[0];
      }

      const capexplanned = await ejecutarStoredProcedure('sp_GetPlannedActividadbyProjectRP',[parseInt(idProject), rpnumbers]);
      if(capexplanned){
        CapexPlanned = capexplanned[0];
      }

      const plannedByAssembly = await ejecutarStoredProcedure('sp_getPlannedByAssembly',[parseInt(idProject), rpnumbers]);
      if(plannedByAssembly){
        plannedAssembly = plannedByAssembly[0];
      }

      const resCapex = await getCatalogs('ct_capex_accounts');
      if(resCapex.length > 0){
        CapexPrincipalAccounts = resCapex;
      }

      const resOpex = await getCatalogs('ct_opex_accounts');
      if(resCapex.length > 0){
        OpexPrincipalAccounts = resOpex;
      }

      const getLastDate = await ejecutarVistaTools('vw_dateprovisional'); /** OBTENEMOS LA ULTIMA FECHA DEL LEDGER CARGADO */
      if(getLastDate.length > 0){
        lastDate = getLastDate[0];
      }

      const FolioProject = CapexSnd ? CapexSnd.Folio_Project : null;
      let SharepointInitialRows
      if(FolioProject){
        SharepointInitialRows = await getSharepointRegisters(FolioProject);
      } else {
        SharepointInitialRows = [];
      }
        
      /** CONSEGUIMOS EL 1ER DÍA DEL MES ANTERIOR Y EL DÍA ACTUAL */
      const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
      const diaDespues = new Date(diaLedged);
      diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
      const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
      const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
      /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
      const SharepointFinalRows = SharepointInitialRows.filter(registro => {
        return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
      });
      
      let CapexAccounts = [];
      let OpexAccounts = [];

      let totalAssemblyCapex = 0;
      let totalPlannedCapex = 0;
      let totalAssemblyOpex = 0;
      let totalPlannedOpex = 0;

      let totalPaidCapex = 0;
      let totalPaidOpex = 0;

      let totalProvisionalCapex = 0;
      let totalProvisionalOpex = 0;

      let FinalAccounts = [];

      let indexcapex = 1;
      let indexopex = 1;
  
      /** ARMADO DE ARRAY CAPEX */
      for(let capexAccount of CapexPrincipalAccounts){
        var subAccounts = [];
        var totalPlanned = 0;
        var totalPaid = 0;
        var totalProvisional = 0;

        for(let account of Accounts){
          if(account.idcapexsubaccount){
            if(capexAccount.idcapexaccounts == account.IDCapexprincipal){
              let capexplan;
              capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber && x.idactivitiesprojects == account.idactivitiesprojects)
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)
              if(provisionalRow.length > 0){
                  for(let prov of provisionalRow){
                    shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                  }
              }

              const existingDuplicate = subAccounts.find(x => x.idActividaddata === capexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idcapexaccount === account.idcapexsubaccount);
              if(existingDuplicate){
                capexplan = CapexPlanned.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.Ca_o_pex == 1 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
              }


              subAccounts.push({
                  idActividaddata: capexplan?.IdActividaddata ,
                  Name:  capexplan ? capexplan.Actividad : '',
                  idactivitiesprojects: account.idactivitiesprojects,
                  account: account.capexconcepto,
                  accountWA: account.subcuentacapex,
                  idcapexaccount: account.idcapexsubaccount,
                  idrpnumber: account.idrpnumber,
                  planned:  capexplan ? parseFloat(capexplan.EstimadoUSD) : 0,
                  paid: account.Presupuesto_Pagado,
                  provisional: shareMonto,
              });

              totalPlanned += capexplan ? parseFloat(capexplan.EstimadoUSD) : 0
              totalPaid += account.Presupuesto_Pagado
              totalProvisional += shareMonto;
              
            }
          }
        }

        for(let plannedAccount of CapexPlanned){
          if(capexAccount.idcapexaccounts == plannedAccount.IDCapexprincipal){
            if(plannedAccount.Ca_o_pex == 1){
                let capexPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idcapexaccount == plannedAccount.idcapexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                if(!capexPaid){
                  subAccounts.push({
                    Name: plannedAccount.Actividad,
                    idactivitiesprojects: plannedAccount.idactivitiesprojects,
                    idcapexaccount: plannedAccount.idcapexsubaccount,
                    idrpnumber: plannedAccount.idrpnumber,
                    account: plannedAccount.subcuentacapex,
                    planned: plannedAccount.EstimadoUSD,
                    paid: 0,
                    provisional: 0,
                  });
                  totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                } else {
                  // console.log(capexPaid, 'cpxPaid');
                }
            }
          }
        }

        CapexAccounts.push({
          id: indexcapex++,
          AccountName: capexAccount.concepto,
          Planned: totalPlanned,
          Paid: totalPaid,
          Provisional: totalProvisional,
          subAccounts: subAccounts
        });

        totalPlannedCapex += totalPlanned
        totalPaidCapex += totalPaid
        totalProvisionalCapex += totalProvisional
      }
  
      /** ARMADO DE ARRAY OPEX */
      for(let opexAccount of OpexPrincipalAccounts){
        var subAccounts = [];
        var totalPlanned = 0;
        var totalPaid = 0;
        var totalProvisional = 0;
        
        for(let account of OpexPaid){
          if(account.idopexsubaccount){
            if(opexAccount.idopexaccounts == account.idopexaccounts){
              let opexplan;
              opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects)
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(account.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == account.idrpnumber && account.idactivitiesprojects && account.idactivitiesprojects == x.fields?.IDAct)
              if(provisionalRow.length >= 0){
                  for(let prov of provisionalRow){
                    shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                  }
              }
              
              const existingDuplicate = subAccounts.find(x => x.idActividaddata === opexplan?.IdActividaddata && x.idactivitiesprojects === account.idactivitiesprojects && x.idrpnumber === account.idrpnumber && x.idopexaccount === account.idopexsubaccount);
              if(existingDuplicate){
                opexplan = CapexPlanned.find(x => x.idopexsubaccount == account.idopexsubaccount && x.Ca_o_pex == 2 && x.idrpnumber == account.idrpnumber &&  x.idactivitiesprojects == account.idactivitiesprojects && x.idActividaddata != existingDuplicate.idActividaddata)
              }

              subAccounts.push({
                  idActividaddata: opexplan?.IdActividaddata ,
                  Name:  opexplan ? opexplan.Actividad : '',
                  idactivitiesprojects: account.idactivitiesprojects,
                  account: account.opexconcepto,
                  accountWA: account.subcuentaopex,
                  idopexaccount: account.idopexsubaccount,
                  idrpnumber: account.idrpnumber,
                  planned:  opexplan ? parseFloat(opexplan.EstimadoUSD) : 0,
                  paid: account.Presupuesto_Pagado,
                  provisional: shareMonto,
              });

              totalPlanned += opexplan ? parseFloat(opexplan.EstimadoUSD) : 0
              totalPaid += account.Presupuesto_Pagado
              totalProvisional += shareMonto;
            }
          }
        }

        for(let plannedAccount of CapexPlanned){
          if(opexAccount.idopexaccounts == plannedAccount.IDOpexprincipal){
            if(plannedAccount.Ca_o_pex == 2){
                let opxPaid = subAccounts.find(x => x.idActividaddata === plannedAccount.IdActividaddata || x.idActividaddata === plannedAccount.IdActividaddata && x.idopexaccount == plannedAccount.idopexsubaccount && x.idactivitiesprojects == plannedAccount.idactivitiesprojects && x.idrpnumber == plannedAccount.idrpnumber);
                if(!opxPaid){
                  subAccounts.push({
                    Name: plannedAccount.Actividad || plannedAccount.NombreActividad,
                    idopexaccount: plannedAccount.idopexsubaccount,
                    idrpnumber: plannedAccount.idrpnumber,
                    account: plannedAccount.subcuentaopex,
                    planned: plannedAccount.EstimadoUSD,
                    paid: 0,
                    provisional: 0,
                  });
                  totalPlanned += parseFloat(plannedAccount.EstimadoUSD)
                } 
                
            }
          }
        }

        OpexAccounts.push({
          id: indexopex++,
          AccountName: opexAccount.concepto,
          Planned: totalPlanned,
          Paid: totalPaid,
          Provisional: totalProvisional,
          subAccounts: subAccounts
        });

        totalPlannedOpex += totalPlanned
        totalPaidOpex += totalPaid
        totalProvisionalOpex += totalProvisional

      }

      for(let assembly of plannedAssembly){
        if(assembly.Ca_o_pex == 1){
          totalAssemblyCapex += assembly.TotalEstimadoUSD
        } else if(assembly.Ca_o_pex == 2){
          totalAssemblyOpex += assembly.TotalEstimadoUSD
        }
      }

      FinalAccounts = [
        {
          id: 1,
          Name: 'Capex Accounts',
          Approved: CapexSnd?.total,
          Assembly: totalAssemblyCapex,
          Planned: totalPlannedCapex,
          Paid: totalPaidCapex,
          Provisional: totalProvisionalCapex,
          Accounts: CapexAccounts
        },
        {
          id: 2,
          Name: 'Opex Accounts',
          Approved: OpexSnd?.valor,
          Assembly: totalAssemblyOpex,
          Planned: totalPlannedOpex,
          Paid: totalPaidOpex,
          Provisional: totalProvisionalOpex,
          Accounts: OpexAccounts
        }
      ]

      return FinalAccounts;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    getByAccountsReport,
    getByAccountsReportXLSX,
    /** funcion para fullReport */
    getByAccountByFullReport
}