const { ejecutarStoredProcedure, ejecutarStoredProcedurev2 } = require('../../queries/projects')
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


async function setSettlement(req, res){
    try {
        let IDUser = await catchUserLogged(req);
        const body = req.body;
        const details = JSON.stringify(body.details_json);
        const deductions = JSON.stringify(body.deductions_json);
        const resultados = await ejecutarStoredProcedurev2('sp_settlement_upsert_full', [
            body.Idsettlement,
            body.idprojects,
            body.idrpnumber_main,
            body.Idsetlecurrency,
            body.PercentageMktPrice,
            body.rp_count,
            IDUser.IDUser,
            details,
            deductions
        ]);
        if(resultados.length > 0){
            res.status(200).json({valido: 1, result: resultados[0]});
        }

    } catch (error) {
        console.log(error);
    }
}

async function getSettlement(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetSettlementPlanning', [req.params.id, req.params.idrpnumber]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function getSettlementDetails(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetSettlementDetails', [req.params.id, req.params.idrpnumber]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function getSettlementDeductions(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetSettlDedByProjRP', [req.params.id, req.params.idrpnumber]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function getRPCountByProject(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetSettlRpCountbyproject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function setStatusSettlement(req, res){
    try {
        let IDUser = await catchUserLogged(req);

        const resultados = await ejecutarStoredProcedurev2('sp_UPDATEstatusSettlement', [
            req.body.Idsettlement,
            req.body.status,
            req.body.statusdirection,
            IDUser.IDUser
        ]);
        if(resultados.length > 0){
            res.status(200).json({valido: 1, result: resultados[0]});
        }

    } catch (error) {
        console.log(error);
    }
}

async function getTotalApprovedByAssembly(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetPlanHisTotalbyAssembly', [req.params.id, req.params.idrpnumber]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        
    }
}

async function setDeleteSettlement(req, res){
    try {
        let IDUser = await catchUserLogged(req);

        const resultados = await ejecutarStoredProcedurev2('sp_settlement_delete', [
            req.body.Idsettlement,
            IDUser.IDUser
        ]);
        if(resultados.length > 0){
            res.status(200).json({valido: 1, result: resultados[0]});
        }

    } catch (error) {
        console.log(error);
    }
}

async function getSettlementXLSX(req, res) {
    try {
        const rp = req.params.idnumber ? req.params.idnumber : 0
        const resultados = await ejecutarStoredProcedure('sp_GetSettlementPlanning', [req.params.id, rp]);
        if (resultados.length > 0) {
            const SettlementRows = resultados[0];

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Settlement registers', {
            properties: { tabColor: { argb: 'FF0000' } }
            });

            sheet.columns = [
                { header: 'Folio', key: 'folio', width: 8 },
                { header: 'Registry Date', key: 'DateCreate', width: 15 },
                { header: 'RP', key: 'idrpnumber', width: 5 },
                { header: 'Type Currency', key: 'typeofcurrency', width: 5 },
                { header: 'Volume', key: 'settlement_volume', width: 10 },
                { header: 'Vintage range', key: 'vintage_range', width: 15 },
                { header: 'Price Canopia', key: 'pricecanopia', width: 15, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Project Gross Income', key: 'project_gross_income', width: 25, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Final CAPEX Approved by Assembly', key: 'Approved', width: 25, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Final Annual Cost Deduction', key: 'ACD', width: 25, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Project Net Income', key: 'Project_Net_Income', width: 25, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Status', key: 'status', width: 25 },
            ];

            sheet.views = [{ state: 'frozen', ySplit: 1 }];

            SettlementRows.forEach(item => {
                sheet.addRow({
                    folio: item.folio,
                    DateCreate: item.DateCreate,
                    idrpnumber: item.idrpnumber,
                    typeofcurrency: item.typeofcurrency,
                    settlement_volume: item.settlement_volume,
                    vintage_range: item.vintage_range,
                    pricecanopia: item.pricecanopia,
                    project_gross_income: item.project_gross_income,
                    Approved: item.Approved,
                    ACD: item.ACD,
                    Project_Net_Income: item.Project_Net_Income,
                    status: sendStatusSettlement(item)
                });
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
        }
    } catch (error) {
        
    }
}

function sendStatusSettlement(settlementRow){
    let statusMessage = ''

    if(settlementRow.status == 1 && settlementRow.statusdirection == 1){
        statusMessage = 'Pending'
    }

    if(settlementRow.status == 1 && settlementRow.statusdirection == 2 || settlementRow.status == 2 && settlementRow.statusdirection == 1){
        statusMessage = 'approved 1 of 2'
    }

    if(settlementRow.status == 2 && settlementRow.statusdirection == 2){
        statusMessage = 'approved 2 of 2'
    }

    if(settlementRow.status == 3 && settlementRow.statusdirection != 3 || settlementRow.status != 3 && settlementRow.statusdirection == 3){
        statusMessage = 'Denied 1 of 2'
    }

    if(settlementRow.status == 3 && settlementRow.statusdirection == 3){
        statusMessage = 'Denied 2 of 2'
    }

    return statusMessage;
}


async function getSettlementXLSXByRegister(req, res){
    try {
        
    } catch (error) {
        
    }
}
module.exports = { 
    setSettlement,
    getSettlement,
    getSettlementDetails,
    getSettlementDeductions,
    getRPCountByProject,
    setStatusSettlement,
    getTotalApprovedByAssembly,
    setDeleteSettlement,
    getSettlementXLSX,
}