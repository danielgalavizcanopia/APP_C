const { ejecutarStoredProcedure } = require('../../queries/projects');
const { ejecutarVistaTools } = require('../../queries/executeViews')

const ExcelJS = require('exceljs');

function getIncidencesReportXLSX(req, res){
    return new Promise(async function (resolve, reject){
        try {            
            const resultados = await ejecutarStoredProcedure('sp_getIncidencesWithStatusHistory', [req.params.id]);
            if(resultados.length > 0){
                let incidences = resultados[0];
                if(incidences.length > 0){

                    const workbook = new ExcelJS.Workbook();
                    const sheet = workbook.addWorksheet('Incidences By project', {
                    properties: { tabColor: { argb: 'FF0000' } }
                    });



                    sheet.columns = [
                        { header: 'Incidence Type', key: 'IncidenceType', width: 18 },
                        { header: 'Impact Type', key: 'ImpactType', width: 18 },
                        { header: 'Incidence Description', key: 'IncidenceDescription', width: 70 },
                        { header: 'Mitgation/actions/updates', key: 'StatusDescription', width: 70, },
                        { header: 'Responsible', key: 'Responsible', width: 20, },
                        { header: 'Incidence Date', key: 'IncidenceDate', width: 20, },
                        { header: 'Date closed', key: 'Dateclosed', width: 20, },
                        { header: 'Status', key: 'Status', width: 20, },
                        { header: 'Last Status Date', key: 'DateCreate', width: 20, }
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

                    incidences.forEach(item => {
                        const newRow = sheet.addRow({
                            IncidenceType: item?.ShortDescIncidenceType,
                            ImpactType: item?.ShortDescriptionImpact,
                            IncidenceDescription: item?.IncidenceDescription,
                            StatusDescription: item?.StatusDescription,
                            Responsible: item.Name,
                            IncidenceDate: item?.DateIncidence,
                            Dateclosed: item?.DateSuggestedAttention,
                            Status: item?.StatusName,
                            DateCreate: item?.DateCreate,
                        });
                    });

                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', `attachment; filename=INCIDENCES.xlsx`);
            
                    await workbook.xlsx.write(res);
                    res.end();
                } else {
                    res.status(200).json({valido: 0, message: "No data found"});
                }
            }
        } catch (error) {
            console.log(error)
        }
    })
}


function getGeneralIncidencesReportsXLSX(req, res){
    return new Promise(async function (resolve, reject){
        try {
             const resultados = await ejecutarVistaTools('vw_incidence_details');
             if(resultados.length > 0){
                let Incidences = resultados;

                if(Incidences.length > 0){
                    const workbook = new ExcelJS.Workbook();

                    const sheet = workbook.addWorksheet('Incidences Report', {
                        properties: { tabColor: { argb: 'FF0000' } }
                    });

                    sheet.columns = [
                        { header: 'N°', key: 'IdIncidence', width: 4 },
                        { header: 'Forestal Owner', key: 'ProjectName', width: 24 },
                        { header: 'Incidence', key: 'Incidencia', width: 57 },
                        { header: 'Impact', key: 'Impact', width: 57 },
                        { header: 'Incidence Description', key: 'IncidenceDescription', width: 57 },
                        { header: 'Immediate Actions', key: 'ImmediateActions', width: 57},
                        { header: 'Name of the person who reported the incident.', key: 'Persona_Levanta_Incidencia', width: 57 },
                        { header: 'Date Reported', key: 'Fecha_Reportada', width: 21 },
                        { header: 'Name of the person who received the incident.', key: 'PersonaRecepciono', width: 54 },
                        // { header: 'Follow-Up', key: 'Seguimiento', width: 82 },
                        { header: 'Status', key: 'Estatus', width: 15 },

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

                    Incidences.forEach(item => {

                        let seguimientos =  item.Seguimiento ? item.Seguimiento.split('||') : ''
                        var segFinal;
                        if(seguimientos.length > 0){
                            segFinal = seguimientos.join('\n');
                        } else {
                            segFinal = item.Seguimiento;
                        }

                        const newRow = sheet.addRow({
                            IdIncidence: item.IdIncidence, 
                            ProjectName: item.ProjectName, 
                            Incidencia: item.Incidencia, 
                            Impact: item.Impact, 
                            IncidenceDescription: item.IncidenceDescription, 
                            ImmediateActions: item.ImmediateActions, 
                            Persona_Levanta_Incidencia: item.Persona_Levanta_Incidencia, 
                            Fecha_Reportada: item.Fecha_Reportada, 
                            PersonaRecepciono: item.PersonaRecepciono, 
                            Asignado_a: item.Asignado_a, 
                            // Seguimiento: segFinal, 
                            Estatus: item.Estatus || "Pending Attention"
                        });

                        const seguimientoCell = newRow.getCell('Seguimiento');
                        seguimientoCell.alignment = { wrapText: true };

                    });

                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

                    await workbook.xlsx.write(res);
                    res.end();
                    
                }
             }
        } catch (error) {
            console.log(error);
               
        }
    });
}
module.exports = {
    getIncidencesReportXLSX,
    getGeneralIncidencesReportsXLSX,
}