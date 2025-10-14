const { ejecutarStoredProcedure } = require('../../queries/projects');
const { ejecutarVistaTools } = require('../../queries/executeViews')
const { getSharepointRegisters } = require('./Sharepoint')
const ExcelJS = require('exceljs');

const dotenv = require("dotenv");
dotenv.config();

/** REDIS IMPORT */
const { redisClient } = require('../../config/redisConfig');

async function getByActivitiesReport(req, res){
      try {

        /** GENERAMOS CLAVE REDIS PARA CONSULTAR CACHE */
        const cacheKey = `${process.env.ENVIRONMENT}-ByActivitiesReport-${parseInt(req.params.idprojects)}-${req.params.rpnumber}`;

        /** SE HACE LA CONSULTA DE CACHÉ, SI ENCUENTRA ALGO, ENTONCES ES LO QUE REGRESARÁ SIN NECESIDAD DE HACER TODO EL FLUJO */
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          console.log('📦 Data desde Redis');
          return res.status(200).json({ valido: 1, result: JSON.parse(cachedData) });
        }

        const resultados = await ejecutarStoredProcedure('sp_GetBudgetTrackerByProjectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(resultados){
          let Accounts = [];
          let CapexSnd
          let OpexSnd
          let CapexPaid
          let OpexPaid
          let lastDate;
  
          const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
          if(capexSigned){
            CapexSnd = capexSigned[0][0];
          }
          
          const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
          if(opexSigned){
            OpexSnd = opexSigned[0][0];
          }
  
          const capexPaid = await ejecutarStoredProcedure('sp_GetCapexPagadoByprojectRP',[parseInt(req.params.idprojects), req.params.rpnumber ]);
          if(capexPaid){
            CapexPaid = capexPaid[0]
          }
  
          const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(req.params.idprojects), req.params.rpnumber]);
          if(opexPaid){
            OpexPaid = opexPaid[0];
          }
  
          Accounts = resultados[0];

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

          const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
          const diaDespues = new Date(diaLedged);
          diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
          const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
          const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
          /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
          const SharepointFinalRows = SharepointInitialRows.filter(registro => {
            return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
          });
    
          let PlannedTotalCpx = 0;
          let PaidTotalCpx = 0;
          let PlannedTotalOpx = 0;
          let PaidTotalCOpx = 0;
          let ProvisionalTotalCpx = 0;
          let ProvisionalTotalCOpx = 0;
  
          let CapexAccounts = []
          let OpexAccounts = []
          let FinalAccounts = [];

          /** NUEVO CÓDIGO */
           /**
            * Esto une lo pagado con lo planeado en CAPEX
            */
          for(let CpxPaid of CapexPaid){
            if(CpxPaid.idcapexsubaccount){
              let plannedActivity = Accounts.find(x => x.Ca_o_pex === 1 && x.idcapexsubaccount === CpxPaid.idcapexsubaccount && x.idactivitiesprojects === CpxPaid.idactivitiesprojects && x.idrpnumber == CpxPaid.idrpnumber);
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(CpxPaid.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == CpxPaid.idrpnumber && x.fields?.IDAct == CpxPaid.idactivitiesprojects);
                if(provisionalRow.length >= 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }
              CapexAccounts.push({
                type: 'Capex',
                idcapexsubaccount: CpxPaid.idcapexsubaccount,
                idrpnumber: CpxPaid.idrpnumber,
                idactivitiesprojects: CpxPaid.idactivitiesprojects,
                NombreActividad: CpxPaid.Actividad,
                AccountNum: CpxPaid.cuentacompaq,
                Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
                Actual: CpxPaid.Presupuesto_Pagado,
                Provisional: shareMonto,
              });

              PlannedTotalCpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
              PaidTotalCpx += CpxPaid.Presupuesto_Pagado;
              ProvisionalTotalCpx += shareMonto;
            }
          }
          
          /**
           * Esto une el resto de lo planeado de capex con lo pagado
           */
          for (let account of Accounts) {
            if (account.Ca_o_pex == 1) {
              let existing = CapexAccounts.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.idactivitiesprojects == account.idactivitiesprojects && x.idrpnumber == account.idrpnumber);
              if(!existing){
                CapexAccounts.push({
                  type: 'Capex',
                  idcapexsubaccount: account.idcapexsubaccount,
                  idactivitiesprojects:  account.idactivitiesprojects,
                  NombreActividad: account.Actividad || account.NombreActividad,
                  AccountNum: account.Cuenta_Compaq || '',
                  Planned: account ? parseFloat(account.EstimadoUSD) : 0,
                  Actual: 0,
                  Provisional: 0,
                });
                PlannedTotalCpx += account ? parseFloat(account.EstimadoUSD) : 0;
              }
            }
          }

          /**
           * Esto une lo pagado con lo planeado en OPEX
           */
          for (let opexPagado of OpexPaid) {
            if(opexPagado.idopexsubaccount){
              let plannedActivity = Accounts.find(x => x.Ca_o_pex === 2 && x.idopexsubaccount === opexPagado.idopexsubaccount && x.idactivitiesprojects === opexPagado.idactivitiesprojects);
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(opexPagado.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == opexPagado.idrpnumber && opexPagado.idactivitiesprojects && opexPagado.idactivitiesprojects == x.fields?.IDAct)
              if(provisionalRow.length >= 0){
                  for(let prov of provisionalRow){
                    shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                  }
              }
              OpexAccounts.push({
                type: 'Opex',
                idopexsubaccount: opexPagado.idopexsubaccount,
                idactivitiesprojects:  opexPagado.idactivitiesprojects,
                NombreActividad: opexPagado.Actividad,
                AccountNum: opexPagado.Cuenta_Compaq || '',
                Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
                Actual: opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0,
                Provisional: shareMonto
              });

              PlannedTotalOpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
              PaidTotalCOpx += opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0;
              ProvisionalTotalCOpx += shareMonto;
            }
          }

          /**
           * Esto une el resto de lo planeado de opex con lo pagado
           */
          for (let account of Accounts) {
            if (account.Ca_o_pex == 2) {
              let existing = OpexAccounts.find(x => x.idopexsubaccount === account.idopexsubaccount && x.idactivitiesprojects === account.idactivitiesprojects);
              if(!existing){
                OpexAccounts.push({
                  type: 'Opex',
                  idopexsubaccount: account.idopexsubaccount,
                  idactivitiesprojects:  account.idactivitiesprojects,
                  NombreActividad: account.Actividad || account.NombreActividad,
                  AccountNum: account.Cuenta_Compaq || '',
                  Planned: account ? parseFloat(account.EstimadoUSD) : 0,
                  Actual: 0,
                  Provisional: 0,
                });
                PlannedTotalOpx += account ? parseFloat(account.EstimadoUSD) : 0;
              }
            }
          }
  
          FinalAccounts = [
            {
              id: 1,
              Name: 'Capex Accounts',
              Approved: CapexSnd?.total,
              PlannedTotal: PlannedTotalCpx,
              PaidTotal: PaidTotalCpx,
              ProvisionalTotal: ProvisionalTotalCpx,
              Accounts: CapexAccounts,
            },
            {
              id: 2,
              Name: 'Opex Accounts',
              Approved: OpexSnd?.valor,
              PlannedTotal: PlannedTotalOpx,
              PaidTotal: PaidTotalCOpx,
              ProvisionalTotal: ProvisionalTotalCOpx,
              Accounts: OpexAccounts,
            }
          ]
  
          await redisClient.set(cacheKey, JSON.stringify(FinalAccounts), { EX: 20 });
          res.status(201).json({valido: 1, result: FinalAccounts});

        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
        console.log(error);
        
      }
  }
  
  function getByActivitiesReportXLSX(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarStoredProcedure('sp_GetBudgetTrackerByProjectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(resultados){
          let Accounts = [];
          let CapexSnd
          let OpexSnd
          let CapexPaid
          let OpexPaid
          let lastDate;
  
          const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
          if(capexSigned){
            CapexSnd = capexSigned[0][0];
          }
          
          const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
          if(opexSigned){
            OpexSnd = opexSigned[0][0];
          }
  
          const capexPaid = await ejecutarStoredProcedure('sp_GetCapexPagadoByprojectRP',[parseInt(req.params.idprojects), req.params.rpnumber ]);
          if(capexPaid){
            CapexPaid = capexPaid[0]
          }
  
          const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(req.params.idprojects), req.params.rpnumber]);
          if(opexPaid){
            OpexPaid = opexPaid[0];
          }
  
          Accounts = resultados[0];
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

          const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
          const diaDespues = new Date(diaLedged);
          diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
          const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
          const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
          /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
          const SharepointFinalRows = SharepointInitialRows.filter(registro => {
            return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
          });
  
          let PlannedTotalCpx = 0;
          let PaidTotalCpx = 0;
          let PlannedTotalOpx = 0;
          let PaidTotalCOpx = 0;
          let ProvisionalTotalCpx = 0;
          let ProvisionalTotalCOpx = 0;
  
          let CapexAccounts = []
          let OpexAccounts = []
          let FinalAccounts = [];
          
          /** NUEVO CÓDIGO */
           /**
            * Esto une lo pagado con lo planeado en CAPEX
            */
          for(let CpxPaid of CapexPaid){
            if(CpxPaid.idcapexsubaccount){
              let plannedActivity = Accounts.find(x => x.Ca_o_pex === 1 && x.idcapexsubaccount === CpxPaid.idcapexsubaccount && x.idactivitiesprojects === CpxPaid.idactivitiesprojects && x.idrpnumber == CpxPaid.idrpnumber);
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(CpxPaid.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == CpxPaid.idrpnumber);
                if(provisionalRow.length >= 0){
                   for(let prov of provisionalRow){
                     shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                   }
                }
              CapexAccounts.push({
                type: 'Capex',
                idcapexsubaccount: CpxPaid.idcapexsubaccount,
                idrpnumber: CpxPaid.idrpnumber,
                idactivitiesprojects: CpxPaid.idactivitiesprojects,
                NombreActividad: CpxPaid.Actividad,
                AccountNum: CpxPaid.cuentacompaq,
                Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
                Actual: CpxPaid.Presupuesto_Pagado,
                Provisional: shareMonto,
              });

              PlannedTotalCpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
              PaidTotalCpx += CpxPaid.Presupuesto_Pagado;
              ProvisionalTotalCpx += shareMonto;
            }
          }
          
          /**
           * Esto une el resto de lo planeado de capex con lo pagado
           */
          for (let account of Accounts) {
            if (account.Ca_o_pex == 1) {
              let existing = CapexAccounts.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.idactivitiesprojects == account.idactivitiesprojects && x.idrpnumber == account.idrpnumber);
              if(!existing){
                CapexAccounts.push({
                  type: 'Capex',
                  idcapexsubaccount: account.idcapexsubaccount,
                  idactivitiesprojects:  account.idactivitiesprojects,
                  NombreActividad: account.Actividad || account.NombreActividad,
                  AccountNum: account.Cuenta_Compaq || '',
                  Planned: account ? parseFloat(account.EstimadoUSD) : 0,
                  Actual: 0,
                  Provisional: 0,
                });
                PlannedTotalCpx += account ? parseFloat(account.EstimadoUSD) : 0;
              }
            }
          }

          /**
           * Esto une lo pagado con lo planeado en OPEX
           */
          for (let opexPagado of OpexPaid) {
            if(opexPagado.idopexsubaccount){
              let plannedActivity = Accounts.find(x => x.Ca_o_pex === 2 && x.idopexsubaccount === opexPagado.idopexsubaccount && x.idactivitiesprojects === opexPagado.idactivitiesprojects);
              let shareMonto = 0;
              let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(opexPagado.cuentacompaq) && opexPagado.idactivitiesprojects && opexPagado.idactivitiesprojects == x.fields?.IDAct)
              if(provisionalRow.length >= 0){
                  for(let prov of provisionalRow){
                    shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
                  }
              }
              OpexAccounts.push({
                type: 'Opex',
                idopexsubaccount: opexPagado.idopexsubaccount,
                idactivitiesprojects:  opexPagado.idactivitiesprojects,
                NombreActividad: opexPagado.Actividad,
                AccountNum: opexPagado.Cuenta_Compaq || '',
                Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
                Actual: opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0,
                Provisional: shareMonto
              });

              PlannedTotalOpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
              PaidTotalCOpx += opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0;
              ProvisionalTotalCOpx += shareMonto;
            }
          }

          /**
           * Esto une el resto de lo planeado de opex con lo pagado
           */
          for (let account of Accounts) {
            if (account.Ca_o_pex == 2) {
              let existing = OpexAccounts.find(x => x.idopexsubaccount === account.idopexsubaccount && x.idactivitiesprojects === account.idactivitiesprojects);
              if(!existing){
                OpexAccounts.push({
                  type: 'Opex',
                  idopexsubaccount: account.idopexsubaccount,
                  idactivitiesprojects:  account.idactivitiesprojects,
                  NombreActividad: account.Actividad || account.NombreActividad,
                  AccountNum: account.Cuenta_Compaq || '',
                  Planned: account ? parseFloat(account.EstimadoUSD) : 0,
                  Actual: 0,
                  Provisional: 0,
                });
                PlannedTotalOpx += account ? parseFloat(account.EstimadoUSD) : 0;
              }
            }
          }
  
          FinalAccounts = [
            {
              id: 1,
              Name: 'Capex Accounts',
              Approved: CapexSnd ? CapexSnd?.total : 0,
              PlannedTotal: PlannedTotalCpx,
              PaidTotal: PaidTotalCpx,
              ProvisionalTotal: ProvisionalTotalCpx,
              Accounts: CapexAccounts,
            },
            {
              id: 2,
              Name: 'Opex Accounts',
              Approved: OpexSnd ? OpexSnd?.valor : 0,
              PlannedTotal: PlannedTotalOpx,
              PaidTotal: PaidTotalCOpx,
              ProvisionalTotal: ProvisionalTotalCOpx,
              Accounts: OpexAccounts,
            }
          ]

          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('By Activities Tracker', {
            properties: { tabColor: { argb: 'FF0000' } }
          });

          sheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombre', key: 'Name', width: 15 },
            { header: 'Activity', key: 'ActivityName', width: 115 },
            { header: 'Aprobado', key: 'Approved', width: 15, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Planeado', key: 'Planned', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Pagado', key: 'Paid', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Provisional', key: 'Provisional', width: 20, style: { numFmt: '"$"#,##0.00' } }
          ];

          sheet.views = [{ state: 'frozen', ySplit: 1 }];

          function printActivities(sheet, accounts, startRow) {
            let currentRow = startRow;
          
            accounts.forEach((account) => {
              sheet.getRow(currentRow).getCell(3).value = account.NombreActividad; 
              sheet.getRow(currentRow).getCell(5).value = account.Planned;
              sheet.getRow(currentRow).getCell(6).value = account.Actual;
              sheet.getRow(currentRow).getCell(7).value = account.Provisional;
              currentRow++; // importante para evitar sobrescribir
            });
          
            return currentRow;
          }
          
          let currentRow = 2;
          
          FinalAccounts.forEach((item) => {
            const newRow = sheet.addRow({
              id: item.id,
              Name: item.Name,
              Approved: item.Approved,
              Planned: item.PlannedTotal,
              Paid: item.PaidTotal,
              Provisional: item.ProvisionalTotal
            });

            newRow.getCell('Name').font = { bold: true };
            newRow.getCell('Approved').font = { bold: true };
            newRow.getCell('Planned').font = { bold: true };
            newRow.getCell('Paid').font = { bold: true };
            newRow.getCell('Provisional').font = { bold: true };
          
            currentRow++;
          
            if (item.Accounts && item.Accounts.length > 0) {
              currentRow = printActivities(sheet, item.Accounts, currentRow);
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
  
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

async function getByActivitiesByFullReport(idProject, rpnumbers){
try {
  const resultados = await ejecutarStoredProcedure('sp_GetBudgetTrackerByProjectRP',[parseInt(idProject), rpnumbers]);
  if(resultados){
    let Accounts = [];
    let CapexSnd
    let OpexSnd
    let CapexPaid
    let OpexPaid
    let lastDate;


    const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(idProject)]);
    if(capexSigned){
      CapexSnd = capexSigned[0][0];
    }
    
    const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[rpnumbers, parseInt(idProject)]);
    if(opexSigned){
      OpexSnd = opexSigned[0][0];
    }

    const capexPaid = await ejecutarStoredProcedure('sp_GetCapexPagadoByprojectRP',[parseInt(idProject), rpnumbers ]);
    if(capexPaid){
      CapexPaid = capexPaid[0]
    }

    const opexPaid = await ejecutarStoredProcedure('sp_GetOpexWithActivities',[parseInt(idProject), rpnumbers]);
    if(opexPaid){
      OpexPaid = opexPaid[0];
    }

    Accounts = resultados[0];

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

    let PlannedTotalCpx = 0;
    let PaidTotalCpx = 0;
    let PlannedTotalOpx = 0;
    let PaidTotalCOpx = 0;
    let ProvisionalTotalCpx = 0;
    let ProvisionalTotalCOpx = 0;

    let CapexAccounts = []
    let OpexAccounts = []
    let FinalAccounts = [];

    /** NUEVO CÓDIGO */
      /**
      * Esto une lo pagado con lo planeado en CAPEX
      */
    for(let CpxPaid of CapexPaid){
      if(CpxPaid.idcapexsubaccount){
        let plannedActivity = Accounts.find(x => x.Ca_o_pex === 1 && x.idcapexsubaccount === CpxPaid.idcapexsubaccount && x.idactivitiesprojects === CpxPaid.idactivitiesprojects && x.idrpnumber == CpxPaid.idrpnumber);
        let shareMonto = 0;
        let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(CpxPaid.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == CpxPaid.idrpnumber && x.fields?.IDAct == CpxPaid.idactivitiesprojects);
          if(provisionalRow.length >= 0){
              for(let prov of provisionalRow){
                shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
              }
          }
        CapexAccounts.push({
          type: 'Capex',
          idcapexsubaccount: CpxPaid.idcapexsubaccount,
          idrpnumber: CpxPaid.idrpnumber,
          idactivitiesprojects: CpxPaid.idactivitiesprojects,
          NombreActividad: CpxPaid.Actividad,
          AccountNum: CpxPaid.cuentacompaq,
          Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
          Actual: CpxPaid.Presupuesto_Pagado,
          Provisional: shareMonto,
        });

        PlannedTotalCpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
        PaidTotalCpx += CpxPaid.Presupuesto_Pagado;
        ProvisionalTotalCpx += shareMonto;
      }
    }
    
    /**
     * Esto une el resto de lo planeado de capex con lo pagado
     */
    for (let account of Accounts) {
      if (account.Ca_o_pex == 1) {
        let existing = CapexAccounts.find(x => x.idcapexsubaccount == account.idcapexsubaccount && x.idactivitiesprojects == account.idactivitiesprojects && x.idrpnumber == account.idrpnumber);
        if(!existing){
          CapexAccounts.push({
            type: 'Capex',
            idcapexsubaccount: account.idcapexsubaccount,
            idactivitiesprojects:  account.idactivitiesprojects,
            NombreActividad: account.Actividad || account.NombreActividad,
            AccountNum: account.Cuenta_Compaq || '',
            Planned: account ? parseFloat(account.EstimadoUSD) : 0,
            Actual: 0,
            Provisional: 0,
          });
          PlannedTotalCpx += account ? parseFloat(account.EstimadoUSD) : 0;
        }
      }
    }

    /**
     * Esto une lo pagado con lo planeado en OPEX
     */
    for (let opexPagado of OpexPaid) {
      if(opexPagado.idopexsubaccount){
        let plannedActivity = Accounts.find(x => x.Ca_o_pex === 2 && x.idopexsubaccount === opexPagado.idopexsubaccount && x.idactivitiesprojects === opexPagado.idactivitiesprojects);
        let shareMonto = 0;
        let provisionalRow = SharepointFinalRows.filter(x => parseInt(x.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(opexPagado.cuentacompaq) && parseInt(x.fields?.RP?.slice(2)) == opexPagado.idrpnumber && opexPagado.idactivitiesprojects && opexPagado.idactivitiesprojects == x.fields?.IDAct)
        if(provisionalRow.length >= 0){
            for(let prov of provisionalRow){
              shareMonto += parseFloat(prov.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(prov.fields?.ImporteProrrateoFactura) : parseFloat(prov.fields?.Total_x0028_DetalleMontoFactura_)
            }
        }
        OpexAccounts.push({
          type: 'Opex',
          idopexsubaccount: opexPagado.idopexsubaccount,
          idactivitiesprojects:  opexPagado.idactivitiesprojects,
          NombreActividad: opexPagado.Actividad,
          AccountNum: opexPagado.Cuenta_Compaq || '',
          Planned: plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0,
          Actual: opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0,
          Provisional: shareMonto
        });

        PlannedTotalOpx += plannedActivity ? parseFloat(plannedActivity.EstimadoUSD) : 0;
        PaidTotalCOpx += opexPagado.Presupuesto_Pagado ? parseFloat(opexPagado.Presupuesto_Pagado) : 0;
        ProvisionalTotalCOpx += shareMonto;
      }
    }

    /**
     * Esto une el resto de lo planeado de opex con lo pagado
     */
    for (let account of Accounts) {
      if (account.Ca_o_pex == 2) {
        let existing = OpexAccounts.find(x => x.idopexsubaccount === account.idopexsubaccount && x.idactivitiesprojects === account.idactivitiesprojects);
        if(!existing){
          OpexAccounts.push({
            type: 'Opex',
            idopexsubaccount: account.idopexsubaccount,
            idactivitiesprojects:  account.idactivitiesprojects,
            NombreActividad: account.Actividad || account.NombreActividad,
            AccountNum: account.Cuenta_Compaq || '',
            Planned: account ? parseFloat(account.EstimadoUSD) : 0,
            Actual: 0,
            Provisional: 0,
          });
          PlannedTotalOpx += account ? parseFloat(account.EstimadoUSD) : 0;
        }
      }
    }

    FinalAccounts = [
      {
        id: 1,
        Name: 'Capex Accounts',
        Approved: CapexSnd?.total,
        PlannedTotal: PlannedTotalCpx,
        PaidTotal: PaidTotalCpx,
        ProvisionalTotal: ProvisionalTotalCpx,
        Accounts: CapexAccounts,
      },
      {
        id: 2,
        Name: 'Opex Accounts',
        Approved: OpexSnd?.valor,
        PlannedTotal: PlannedTotalOpx,
        PaidTotal: PaidTotalCOpx,
        ProvisionalTotal: ProvisionalTotalCOpx,
        Accounts: OpexAccounts,
      }
    ]

    return FinalAccounts;
  }
} catch (error) {
  
}
}

module.exports = {
    getByActivitiesReport,
    getByActivitiesReportXLSX,
    /** function full financial report */
    getByActivitiesByFullReport,
}