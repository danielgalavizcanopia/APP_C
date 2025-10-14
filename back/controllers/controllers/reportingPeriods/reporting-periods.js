const { ejecutarStoredProcedure } = require('../../queries/projects')
const jwt = require('jsonwebtoken');
const moment = require('moment');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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

async function getReportingPeriods(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetReportingPeriodsByProyecto', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function dateDifference(startDate, endDate) {
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    const fechaInicio = moment(startDate, 'YYYY-MM-DD');
    const fechaFin = moment(endDate, 'YYYY-MM-DD');

    const diferencia = fechaFin.diff(fechaInicio, 'days');
    // const diff = start.getTime() - end.getTime();
    // const days = diff / (1000 * 60 * 60 * 24)
    return diferencia;
}

function getLastDayOfYear(date) {
    const year = date.getFullYear();
    return new Date(year, 11, 31);
}

function getFirstDayOfYear(date) {
    const year = date.getFullYear();
    return new Date(year, 0, 0);
}

async function setReportingPeriods(req, res) {
    return new Promise(async function(resolve, reject){
        const rpStart = new Date(req.body.Reporting_period_start)
        const rpEnd = new Date(req.body.RPEnd)
        // const rpRPEnd = new Date(req.body.Reporting_period_end)
        // const rpVEREnd = new Date(req.body.Verification_End)
        // const rpISSEnd = new Date(req.body.Issuance_End)

        const MonitoringStart = addDays(rpEnd, 15); /** SE LE SUMAN 15 DIAS */
        const VerificationStart = addDays(MonitoringStart, 30); /** SE LE SUMAN 30 DIAS */
        const VerificationEnd = addDays(VerificationStart, 30); /** SE LE SUMAN 30 DIAS */
        const IssuanceStart = addDays(VerificationEnd, 30); /** SE LE SUMAN 30 DIAS */

        let MonitoringSTStatus
        let MonitoringEndStatus
        if(req.body.Monitoring_Start &&  req.body.Monitoring_End){
            MonitoringSTStatus = new Date(req.body.Monitoring_Start) < new Date() || new Date(req.body.Monitoring_Start) == new Date() ? 'Actual' : 'Forecast';
            MonitoringEndStatus = new Date(req.body.Monitoring_End) < new Date() || new Date(req.body.Monitoring_End) == new Date() ? 'Actual' : 'Forecast';
        } else {
            MonitoringSTStatus = 'Pending';
            MonitoringEndStatus = 'Pending';
        }


        let RPSTStatus
        let RPEndStatus
        if(req.body.Reporting_period_start && req.body.RPEnd){
            RPSTStatus = new Date(req.body.Reporting_period_start) < new Date() || new Date(req.body.Reporting_period_start) == new Date() ? 'Actual' : 'Forecast';
            RPEndStatus = new Date(req.body.RPEnd) < new Date() || new Date(req.body.RPEnd) == new Date() ? 'Actual' : 'Forecast';
        } else {
            RPSTStatus = 'Pending';
            RPEndStatus = 'Pending';
        }

        
        let VerificationSTStatus
        let VerificationEndStatus
        if(req.body.Ve_St && req.body.Verification_End){
            VerificationSTStatus = new Date(req.body.Ve_St) < new Date() || new Date(req.body.Ve_St) == new Date() ? 'Actual' : 'Forecast';
            VerificationEndStatus = new Date(req.body.Verification_End) < new Date() || new Date(req.body.Verification_End) == new Date() ? 'Actual' : 'Forecast';
        } else {
            VerificationSTStatus = 'Pending';
            VerificationEndStatus = 'Pending';
        }

        let IssuanceSTStatus
        let IssuanceEndStatus
        if(req.body.Issuance_Start && req.body.Issuance_End){
            IssuanceSTStatus = new Date(req.body.Issuance_Start) < new Date() || new Date(req.body.Issuance_Start) == new Date() ? 'Actual' : 'Forecast';
            IssuanceEndStatus = new Date(req.body.Issuance_End) < new Date() || new Date(req.body.Issuance_End) == new Date() ? 'Actual' : 'Forecast';
        } else {
            IssuanceSTStatus = 'Pending';
            IssuanceEndStatus = 'Pending';
        }

        var Volume

        if (req.body.Issuance_Vol) {
            Volume = req.body.Issuance_Vol;
        }
        if (!Volume && req.body.VerificationVol) {
            Volume = req.body.VerificationVol;
        }
        if (!Volume && req.body.CMW_Monitoring_Vol) {
            Volume = req.body.CMW_Monitoring_Vol;
        }
        if (!Volume && req.body.Calculated_Volume) {
            Volume = req.body.Calculated_Volume;
        }
        if (!Volume) {
            Volume = req.body.MR_Vol;
        }

        console.log("Volume value -->", Volume)

        let mrVolInicioAnio = 0;
        let mrVolFinAnio = 0;

        let assignedMRVol;

        let anioInicio;
        let anioFin;
    
        const diasTotales = dateDifference(req.body.Reporting_period_start, req.body.RPEnd);
    
        if (rpStart.getFullYear() === rpEnd.getFullYear()) {
            assignedMRVol = Volume;
            anioInicio = rpStart.getFullYear();
        } else {
            const diasInicioAnio = dateDifference(rpStart, getLastDayOfYear(rpStart));
            const diasFinAnio = dateDifference(getFirstDayOfYear(rpEnd), rpEnd);
           
            mrVolInicioAnio = Math.floor((diasInicioAnio / diasTotales) * Volume);
    
            
            const diasTotalesAnioFin = 365;
            mrVolFinAnio = Math.floor((diasFinAnio / diasTotales) * Volume);
    
            anioInicio = rpStart.getFullYear();
            anioFin = rpEnd.getFullYear();
        }
    
        try {
            const resultados = await ejecutarStoredProcedure('sp_setReportingPeriods', [
                req.body.id_reporting_period,
                req.body.RP_ID,
                req.body.Folio_Project,
                req.body.idprojects,
                req.body.Component_ProjectName,
                req.body.RP_Number,
                req.body.Project_Aggregated,
                req.body.id_StatusReporting,
                req.body.id_Programme,
                req.body.id_Group,
                req.body.Verifier,
                req.body.id_Type_Registration_Route,
                req.body.id_reporting_period ? new Date(req.body.Monitoring_Start) : MonitoringStart,
                MonitoringSTStatus,
                req.body.Monitoring_End ? new Date(req.body.Monitoring_End) : null,
                MonitoringEndStatus,
                req.body.CMW_Monitoring_Vol,
                req.body.Reporting_period_start ? new Date(req.body.Reporting_period_start) : null,
                RPSTStatus,
                req.body.RPEnd ? new Date(req.body.RPEnd) : null,
                RPEndStatus,
                req.body.Calculated_Volume,
                req.body.id_reporting_period ?  new Date(req.body.Ve_St) : VerificationStart,
                VerificationSTStatus,
                req.body.id_reporting_period ? new Date(req.body.Verification_End) : VerificationEnd,
                VerificationEndStatus,
                req.body.VerificationVol,
                req.body.id_reporting_period ? new Date(req.body.Issuance_Start) : IssuanceStart,
                IssuanceSTStatus,
                req.body.Issuance_End ? new Date(req.body.Issuance_End) : null,
                IssuanceEndStatus,
                req.body.Issuance_Vol,
                assignedMRVol ? assignedMRVol : Volume
            ]);
            if (resultados.length > 0) {

                var idRP = resultados[0][0].idreporting_period;

                if(anioInicio && anioFin){
                    const resultadosTwoYears = await ejecutarStoredProcedure('sp_setRPVolumTwoYears',
                         [req.body.IDreportingperiodsvolumeyears ? req.body.IDreportingperiodsvolumeyears : 0,
                             idRP,
                              anioInicio,
                               mrVolInicioAnio,
                                anioFin,
                                 mrVolFinAnio])
                    if(resultadosTwoYears.length > 0){
                        res.status(200).json({valido: 1, result: resultados[0]});
                    } else {
                        res.status(404).json({ message: "Data years not inserted." })
                    }
                } else {
                    const resultadosOneYear = await ejecutarStoredProcedure('sp_setRPVolumOneYears',
                         [req.body.IDreportingperiodsvolumeyears ? req.body.IDreportingperiodsvolumeyears : 0,
                             idRP,
                              anioInicio,
                               assignedMRVol ? assignedMRVol : Volume])
                    if(resultadosOneYear.length > 0){
                        res.status(200).json({valido: 1, result: resultados[0]});
                    } else {
                        res.status(404).json({ message: "Data years not inserted." })
                    }
                }

            } else {
                res.status(404).json({ message: "No data found for the given project ID." });
            }
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: "An error occurred while processing your request." });
        }
    })
}

async function getReportingPeriodsByID(req, res) {
    return new Promise(async function (resolve, reject){
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetReportingPeriodsByID', [req.params.id]);
            if (resultados.length > 0) {
                res.status(200).json({valido: 1, result: resultados[0]});
            } else {
                res.status(404).json({ message: "No data found for the given project ID." });
            }
        } catch (error) {
            res.status(500).json({ message: "An error occurred while processing your request." });
        }
    })
}

async function getReportingPeriodsVolumeYear(req, res) {
    return new Promise(async function (resolve, reject){
        try {
            const resultados = await ejecutarStoredProcedure('sp_GetReportingPeriodsVolumeYears', [req.params.id]);
            if (resultados.length > 0) {
                res.status(200).json({valido: 1, result: resultados[0]});
            } else {
                res.status(404).json({ message: "No data found for the given project ID." });
            }
        } catch (error) {
            res.status(500).json({ message: "An error occurred while processing your request." });
        }
    })
}

async function getReportingPeriodsSummary(req, res) {
    return new Promise(async function (resolve, reject){
        try {
            const resultados = await ejecutarStoredProcedure('sp_GETRPSummary', [req.params.id]);
            if (resultados.length > 0) {
                res.status(200).json({valido: 1, result: resultados[0]});
            } else {
                res.status(404).json({ message: "No data found for the given project ID." });
            }
        } catch (error) {
            res.status(500).json({ message: "An error occurred while processing your request." });
        }
    })
}

async function generateXLSXReportingPeriod(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetRP_Excel', [req.params.id]);
        
        if (resultados.length > 0) {
            const RPinitialInfo = resultados[0];

            if (RPinitialInfo) {
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Reporting Periods', {
                    properties: { tabColor: { argb: 'FF0000' } }
                });


                const initialColumns = [
                    { header: 'RP Name', key: 'idrpnumber', width: 22 },
                    { header: 'Component (Project Name)', key: 'Component_ProjectName', width: 22 },
                    { header: 'Project (Aggregated)', key: 'Project_Aggregated', width: 22 },
                    { header: 'Status', key: 'DescriptionStatus', width: 22 },
                    { header: 'Programme', key: 'description_programme', width: 22 },
                    { header: 'Group', key: 'DescriptionGroup', width: 22 },
                    { header: 'V Type (Registration Route)', key: 'Description_Registration', width: 22 },
                    { header: 'Verifier', key: 'DescriptionGroup', width: 22 },
                    { header: 'Monitoring Start', key: 'Monitoring_Start', width: 22 },
                    { header: 'Monitoring Start Status', key: 'Monitoring_St_Status', width: 22 },
                    { header: 'Monitoring End', key: 'Monitoring_End', width: 22 },
                    { header: 'Monitoring End Status', key: 'Monitorin_End_Status', width: 22 },
                    { header: 'RP Start', key: 'Reporting_period_start', width: 22 },
                    { header: 'RP Start Status', key: 'RP_st_status', width: 22 },
                    { header: 'RP End', key: 'Reporting_period_end', width: 22 },
                    { header: 'RP End Status', key: 'RP_end_status', width: 22 },
                    { header: 'MR Vol', key: 'Calculated_Volume', width: 22 },
                    { header: 'Verification Start', key: 'Ve_St', width: 22 },
                    { header: 'Verification Start Status', key: 'Verification_Start_Status', width: 22 },
                    { header: 'Verification End', key: 'Verification_End', width: 22 },
                    { header: 'Verification End Status', key: 'Verification_End_Status', width: 22 },
                    { header: 'Verification Volume', key: 'VerificationVol', width: 22 },
                    { header: 'Issuance Start', key: 'Issuance_Start', width: 22 },
                    { header: 'Issuance Start Status', key: 'Issuance_Start_Status', width: 22 },
                    { header: 'Issuance End', key: 'Issuance_End', width: 22 },
                    { header: 'Issuance End Status', key: 'Issuance_End_tatus', width: 22 },
                    { header: 'RP Total', key: 'RP_total', width: 22 }
                ];


                const startYear = 2022;
                const endYear = 2040;

                const yearColumns = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
                    const year = startYear + i;
                    return { header: `${year}`, key: `year_${year}`, width: 10 };
                });

                sheet.columns = [...initialColumns, ...yearColumns];

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

                RPinitialInfo.forEach((RPinfo, rowIndex) => {
                    const row = sheet.getRow(rowIndex + 2);

                    row.getCell(1).value = 'RP' + RPinfo.idrpnumber;
                    row.getCell(2).value = RPinfo.Component_ProjectName;
                    row.getCell(3).value = RPinfo.Project_Aggregated;
                    row.getCell(4).value = RPinfo.DescriptionStatus;
                    row.getCell(5).value = RPinfo.description_programme;
                    row.getCell(6).value = RPinfo.DescriptionGroup;
                    row.getCell(7).value = RPinfo.Description_Registration;
                    row.getCell(8).value = RPinfo.verifier;
                    row.getCell(9).value = RPinfo.Monitoring_Start.toISOString().split('T')[0];
                    row.getCell(10).value = RPinfo.Monitoring_St_Status;
                    row.getCell(11).value = RPinfo.Monitoring_End.toISOString().split('T')[0];
                    row.getCell(12).value = RPinfo.Monitorin_End_Status;
                    row.getCell(13).value = RPinfo.Reporting_period_start.toISOString().split('T')[0];
                    row.getCell(14).value = RPinfo.RP_st_status;
                    row.getCell(15).value = RPinfo.Reporting_period_end.toISOString().split('T')[0];
                    row.getCell(16).value = RPinfo.RP_end_status;
                    row.getCell(17).value = RPinfo.Calculated_Volume;
                    row.getCell(18).value = RPinfo.Ve_St.toISOString().split('T')[0];
                    row.getCell(19).value = RPinfo.Verification_Start_Status;
                    row.getCell(20).value = RPinfo.Verification_End.toISOString().split('T')[0];
                    row.getCell(21).value = RPinfo.Verification_End_Status;
                    row.getCell(22).value = RPinfo.VerificationVol;
                    row.getCell(23).value = RPinfo.Issuance_Start.toISOString().split('T')[0];
                    row.getCell(24).value = RPinfo.Issuance_Start_Status;
                    row.getCell(25).value = RPinfo.Issuance_End.toISOString().split('T')[0];
                    row.getCell(26).value = RPinfo.Issuance_End_tatus;
                    row.getCell(27).value = RPinfo.RP_total;

                    for (let year = startYear; year <= endYear; year++) {
                        const yearValue = RPinitialInfo.find(x => x.idreporting_period == RPinfo.idreporting_period)?.[year];
                        // const yearValue = RPinfo[year];
                        if (yearValue) {
                            const yearColumnIndex = sheet.columns.findIndex(col => col.header === `${year}`) + 1;
                            row.getCell(yearColumnIndex).value = yearValue || 0
                        }
                    }
                });

                // Enviar el archivo Excel como respuesta
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

                await workbook.xlsx.write(res);
                res.end();
            } else {
                res.status(404).json({ valido: 0, message: "No results found" });
            }
        } else {
            res.status(404).json({ valido: 0, message: "No data found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ valido: 0, message: "Server error" });
    }
}


module.exports = {
    getReportingPeriods,
    setReportingPeriods,
    getReportingPeriodsByID,
    getReportingPeriodsVolumeYear,
    getReportingPeriodsSummary,
    generateXLSXReportingPeriod,
    
}