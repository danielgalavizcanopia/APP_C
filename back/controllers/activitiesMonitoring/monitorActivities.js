const { ejecutarStoredProcedure } = require('../../queries/projects')
const { ejecutarVistaMAct, ejecutarVistaTools } = require('../../queries/executeViews')
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');

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

function getMonitorActivities(req, res){
    return new Promise(async function(resolve, reject){
      try {
        const resultados = await ejecutarVistaMAct('t_vista_monitoractivities', req.params.id);
        if(resultados){
          res.status(201).json({valido: 1, result: resultados});
        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
      } catch (error) {
      }
    });
  }


function getReporteActividadByProject(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getReporteActividadByProject',[req.params.rpnumber, req.params.idprojects]);
      if(resultados){
        let activities = resultados[0]
        let reportingactivities = resultados[1]

        let activitiesFinal = [];
        if(activities.length > 0){
          for(let activity of activities){
            let reports = reportingactivities.filter(report => report.IdActividaddata === activity.IdActividaddata)
            
            activitiesFinal.push({
              IdActividaddata: activity.IdActividaddata,
              Actividad: activity.Actividad,
              IdstatusReporteoActividades: activity.IdstatusReporteoActividades,
              StatusName: activity.StatusName,
              reporting: reports
            });
          }

          res.status(201).json({valido: 1, result: activitiesFinal});

        } else {
          res.status(201).json({valido: 0, message: "No activities found"});
        }
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function setReporteoActivities(req, res){
  return new Promise(async function(resolve, reject){
    try {
      let IDUser = await catchUserLogged(req);

      let body = req.body.reporteo;
      let indice = 0;

      if(body.length == 0){
          res.status(500).json({valido: 0, message: "Was an error, please, enter one or more rows"});
      } else {
        for(let i=0; i < body.length; i++){
  
          let reporteo = body[i];
  
          const reporteoactividades = await ejecutarStoredProcedure('sp_SetReporteoActividades',[
            reporteo.Idreporteoactividades ? reporteo.Idreporteoactividades : 0,
            reporteo.Idcuantitativo ? reporteo.Idcuantitativo.IdActividadRelCuantitativo : reporteo.Idactividadrelcuantitativo,
            reporteo.Idcuantitativo.Idcuantitativo,
            reporteo.AvanceCuantitativo,
            reporteo.begindate.split('T')[0],
            reporteo.enddate.split('T')[0],
            reporteo.calculatedprogress,
            reporteo.NumJornales ? reporteo.NumJornales : 0,
            reporteo.participatingM ? reporteo.participatingM : 0,
            reporteo.participatingW ? reporteo.participatingW : 0,
            reporteo.status,
            IDUser.IDUser
          ]);
          if(reporteoactividades){          
              indice += 1;
              if(i + 1 == body.length){
                res.status(201).json({valido: 1, message: "Save all rows!", result: reporteoactividades[0]});
              }
          } else {
    
          }
        }
      }


    } catch (error) {

    }
  });
}

function setStatusReporteoactivities(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_setStatusReporteoactividades',[
        req.body.p_Idstatus,
        req.body.p_IdActividaddata,
        req.body.p_IdstatusReporteoActividades,
        req.body.p_IDUser
      ]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}

function getReporteoByActivity(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getReportDetailByIdActivity',[req.params.idactividad]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}

function getActivitiesApproved(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_GetActividadesAprobadas',[req.params.idrpnumber, req.params.idprojects]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}

function getReportActDetailById(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getReporteActDetalleById',[req.params.id]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}


function getSummaryActivity(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_GetresumenActividadByactividad',[req.params.id]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}

function getMonitorDates(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getActividadesByProject_Rp',[req.params.rpnumber, req.params.idprojects]);
      if(resultados){
        res.status(201).json({valido: 1, result: resultados[0]});
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}

function generateReporteActividadByProject(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getReporteActividadByProject',[req.params.rpnumber, req.params.idprojects]);
      if(resultados){

        let activities = resultados[0]
        let Registros = resultados[1];

        if(Registros.length != 0){
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('KPI Monitor Data By Project', {
            properties: { tabColor: { argb: 'FF0000' } }
          });

          sheet.columns = [
            { header: 'ID Act', key: 'IdActividaddata', width: 10 },
            { header: 'Activity', key: 'NombreActividad', width: 60 },
            { header: 'Indicator', key: 'cuantitativo', width: 25 },
            { header: 'KPI', key: 'Metrica', width: 22 },
            { header: 'Quantity Goal', key: 'estimado', width: 22 },
            { header: 'Quantity to Date', key: 'AvanceCuantitativo', width: 22 },
            { header: 'Progress', key: 'calculatedprogress', width: 22 },
            { header: 'Part Woman', key: 'participatingW', width: 22 },
            { header: 'Part Man', key: 'participatingM', width: 22 },
            { header: 'Jobs  Benefits', key: 'NumJornales', width: 22 },
          ];

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
    
          sheet.views = [{ state: 'frozen', ySplit: 1 }];

          Registros.forEach(item => {

            let activity = activities.find(report => report.IdActividaddata === item.IdActividaddata)

            const newRow =  sheet.addRow({
              IdActividaddata: activity.IdActividaddata,
              NombreActividad: activity.Actividad,
              cuantitativo: item.cuantitativo,
              Metrica: item.Metrica,
              estimado: item.estimado,
              AvanceCuantitativo: item.AvanceCuantitativo,
              calculatedprogress: parseFloat(item.calculatedprogress) / 100,
              participatingW: item.participatingW,
              participatingM: item.participatingM,
              NumJornales: item.NumJornales,
            });

            newRow.getCell('calculatedprogress').numFmt = '0.00%';

          });


          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

          await workbook.xlsx.write(res);
          res.end();

        }
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
    }
  });
}
  

function generateDatesXlsxReport(req, res){
  return new Promise(async function(resolve, reject){
    try {
      const resultados = await ejecutarStoredProcedure('sp_getActividadesByProject_Rp',[req.params.rpnumber, req.params.idprojects]);
      if(resultados){

        let Registros = resultados[0];

        if(Registros.length != 0){
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('KPI Monitor Data', {
            properties: { tabColor: { argb: 'FF0000' } }
          });

          sheet.columns = [
            { header: 'Activity', key: 'nombreactividad', width: 60 },
            { header: 'Start Date Planned', key: 'actividaddatestart', width: 22 },
            { header: 'End Date Planned', key: 'actividaddateend', width: 22 },
            { header: 'Start Date Actual', key: 'StartDateActual', width: 22 },
            { header: 'End Date Actual', key: 'EndDateActual', width: 22 },
            { header: 'Start Delayed', key: 'StartDelayed', width: 22 },
            { header: 'End Delayed', key: 'EndDelayed', width: 22 },
          ];

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

          Registros.forEach(item => {
            sheet.addRow({
              nombreactividad: item.nombreactividad,
              actividaddatestart: item.actividaddatestart,
              actividaddateend: item.actividaddateend,
              StartDateActual: item.StartDateActual,
              EndDateActual: item.EndDateActual,
              StartDelayed: item.StartDelayed ? item.StartDelayed + " days ago" : '',
              EndDelayed: item.EndDelayed ? item.EndDelayed + " days ago" : '',
            });
          });

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

          await workbook.xlsx.write(res);
          res.end();
          
        }
      } else {
        res.status(500).json({valido: 0, message: "Was an error, please, try again"});
      }
    } catch (error) {
      console.log(error);
      
    }
  });
}

function generateKPIGeneralReport(req, res){
  return new Promise(async function(resolve, reject){
    let Actividades = [];
    let KPIRows = [];
    const getActividades = await ejecutarVistaTools('vw_generalactivityreport');
    if(getActividades.length > 0){
      Actividades = getActividades;
    }

    if(Actividades){
      let Reporteo = [];

      for (let act = 0; act < Actividades.length; act++) {
        const actividad = Actividades[act];

        var fechaInicio = new Date(actividad.actividaddatestart).getTime();
        var fechaFin = new Date(actividad.actividaddateend).getTime();
        var difInitial = fechaFin - fechaInicio;
        var diff = difInitial/(1000*60*60*24);
        
        Reporteo.push({
          idprojects: actividad.idprojects,
          ProjectName: actividad.ProjectName,
          idrpnumber: actividad.idrpnumber,
          IdActividaddata: actividad.IdActividaddata,
          Actividad: actividad.Activity,
          estimado: actividad.estimado,
          AvanceCuantitativo: actividad.AvanceCuantitativo,
          calculatedprogress: calcularPorcentaje(actividad.AvanceCuantitativo, actividad.estimado)  / 100,
          nombre: actividad.Indicator,
          Metrica: actividad.KPI,
          Planeado: actividad.EstimadoUSD,
          Pagado: actividad.Amount_USD,
          actividaddatestart: actividad.actividaddatestart,
          actividaddateend: actividad.actividaddateend,
          KpiDifference: diff,
          actualdatestart: actividad.StartDateActual,
          actualdateend: actividad.EndDateActual,
          NumJornales: actividad.Journals,
          participatingM: actividad.participatingM,
          participatingW: actividad.participatingW,
        });
        
      }

      const workbook = new ExcelJS.Workbook();

      const sheet = workbook.addWorksheet('Activity Reporting', {
        properties: { tabColor: { argb: 'FF0000' } }
      });

      sheet.columns = [
        { header: 'ProjectID', key: 'idprojects', width: 10 },
        { header: 'ProjectName', key: 'ProjectName', width: 38 },
        { header: 'RP #', key: 'idrpnumber', width: 5 },
        { header: 'Activity ID', key: 'IdActividaddata', width: 10 },
        { header: 'Activity', key: 'Actividad', width: 65 },
        { header: 'Indicator', key: 'nombre', width: 40 },
        { header: 'Quantity Goal', key: 'estimado', width: 15 },
        { header: 'KPI', key: 'Metrica', width: 20 },
        { header: 'Quantity Progress', key: 'AvanceCuantitativo', width: 18 },
        { header: 'Percentage of progress', key: 'calculatedprogress', width: 20 },
        { header: 'Start Date', key: 'actividaddatestart', width: 11 },
        { header: 'End Date', key: 'actividaddateend', width: 11 },
        { header: 'Start date vs End date', key: 'KpiDifference', width: 20 },
        { header: 'Actual Start Date', key: 'actualdatestart', width: 15 },
        { header: 'Actual End Date', key: 'actualdateend', width: 15 },
        { header: 'Journals', key: 'NumJornales', width: 15 },
        { header: 'Participating Man', key: 'participatingM', width: 20 },
        { header: 'Participating Woman', key: 'participatingW', width: 20 },
      ];

      sheet.views = [{ state: 'frozen', ySplit: 1 }];

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

      Reporteo.forEach(item => {
            const newRow = sheet.addRow({
              idprojects: item.idprojects,
              ProjectName: item.ProjectName,
              idrpnumber: item.idrpnumber,
              IdActividaddata: item.IdActividaddata,
              Actividad: item.Actividad,
              estimado: item.estimado,
              nombre: item.nombre,
              AvanceCuantitativo: item.AvanceCuantitativo,
              Metrica: item.Metrica,
              calculatedprogress: item.calculatedprogress,
              actividaddatestart: item.actividaddatestart,
              actividaddateend: item.actividaddateend,
              KpiDifference: item.KpiDifference,
              /* AQUI VAN LAS FECHAS ACTUAL */
              actualdatestart: item.actualdatestart,
              actualdateend: item.actualdateend,
              NumJornales: item.NumJornales,
              participatingM: item.participatingM,
              participatingW: item.participatingW,
            });
            newRow.getCell('calculatedprogress').numFmt = '0.00%';
    });
    
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    }

  });
}

function calcularPorcentaje(avance, meta) {
  if (meta === 0) {
      return 0;
  }
  let Percentage = (avance / meta) * 100;
  if(Percentage > 100){
    return 100;
  } else {
    return (avance / meta) * 100;
  }
}



module.exports = {
    getMonitorActivities,

    setStatusReporteoactivities,
    getActivitiesApproved,
    setReporteoActivities,
    getSummaryActivity,
    getReporteoByActivity,
    getReporteActividadByProject,
    getMonitorDates,
    getReportActDetailById,
    // getBudgetTrackerByProjectRP,

    /** funciones generadoras de excel */
    // generateXLSXBT,
    generateReporteActividadByProject,
    generateDatesXlsxReport,

    /** GENERAR REPORTE DE MERCURIA */
    generateKPIGeneralReport,

} 