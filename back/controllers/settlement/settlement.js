const { ejecutarStoredProcedure, ejecutarStoredProcedurev2 } = require('../../queries/projects');
const { getCatalogs, OriginationPercentage } = require('../../queries/catalogs');
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

        let details = [];
        let deductions = [];
        let paymentType = [];

        let params = req.query;
        const settlementDetails = await ejecutarStoredProcedure('sp_GetSettlementDetails', [req.params.id, req.params.idrpnumber]);
        if (settlementDetails.length > 0) {
            details = settlementDetails[0];
        }

        const settlementDeductions = await ejecutarStoredProcedure('sp_GetSettlDedByProjRP', [req.params.id, req.params.idrpnumber]);
        if (settlementDeductions.length > 0) {
           deductions = settlementDeductions[0]
        }

        const getpaymentType = await getCatalogs('ct_prepayment');
        if(getpaymentType.length > 0){
            paymentType = getpaymentType;
        }

        if(details.length > 0 && deductions.length > 0){
            const workbook = new ExcelJS.Workbook();
            
            /** ARMADO HOJA SETTLEMENT INFO (SETTLEMENT DETAILS) */
            const sheet = workbook.addWorksheet('Settlement Info', { 
                properties: { tabColor: { argb: 'FF0000' } } 
            });

            const titleStyle = {
                font: { bold: true, size: 12, color: { argb: '00000000' } },
                alignment: { vertical: 'bottom', horizontal: 'left' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3DB87B' } }, // Verde
            };
        
            const headerStyle = {
                font: { bold: true, size: 12, color: { argb: 'FF000000' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } }, // Verde claro
                alignment: { vertical: 'middle', horizontal: 'center' },
            };

            sheet.getColumn(1).width = 15;
            sheet.getColumn(2).width = 15;
            sheet.getColumn(3).width = 15;
            sheet.getColumn(4).width = 20;
            sheet.getColumn(5).width = 15;
            sheet.getColumn(6).width = 15;
            sheet.getColumn(7).width = 15;

            sheet.mergeCells('A1:G1');
            sheet.getCell('A1').value = 'Project Info';

            sheet.getCell('A2').value = 'ID CANOPIA';
            sheet.getCell('B2').value = 'ID CAR';
            sheet.getCell('C2').value = 'Name project';
            sheet.getCell('D2').value = 'Project counterpart';
            sheet.getCell('E2').value = 'Folio';
            sheet.getCell('F2').value = 'RP';
            sheet.getCell('G2').value = 'Registry date';

            sheet.getCell('A3').value = params.idprojects;
            sheet.getCell('B3').value = params.carId ? params.carId : '';
            sheet.getCell('C3').value = params.projectName;
            sheet.getCell('D3').value = params.projectCounter;
            sheet.getCell('E3').value = params.folio;
            sheet.getCell('F3').value = 'RP' + req.params.idrpnumber;
            sheet.getCell('G3').value = params.registryDate.split('T')[0];

            sheet.mergeCells('A5:G5');
            sheet.getCell('A5').value = 'Settlement planning';

            sheet.getCell('A6').value = 'Volume';
            sheet.getCell('B6').value = 'Vintage';
            sheet.getCell('C6').value = 'Mkt Price (USD)';
            sheet.getCell('D6').value = 'Payment type';
            sheet.getCell('E6').value = 'Mkt price %';
            sheet.getCell('F6').value = 'Price canopia';
            sheet.getCell('G6').value = 'Total';

            details.forEach(async (settlementRow, index) =>{
                const row = 7 + index;
                const paymentName = paymentType.find(pt => pt.Idprepayment === settlementRow.Idprepayment)?.Descripprepayment;

                sheet.getCell(`A${row}`).value = settlementRow.settlement_volume;
                sheet.getCell(`B${row}`).value = settlementRow.vintage;

                const marketpriceCell = sheet.getCell(`C${row}`);
                marketpriceCell.value = settlementRow.markert_price;
                marketpriceCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

                sheet.getCell(`D${row}`).value = paymentName;
                sheet.getCell(`E${row}`).value = settlementRow.PercentageMktPrice;

                const priceCanopiaCell = sheet.getCell(`F${row}`);
                priceCanopiaCell.value = settlementRow.pricecanopia;

                const totalCell = sheet.getCell(`G${row}`);
                totalCell.value = settlementRow.Total;
                totalCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
            });

            const lastRow = 7 + details.length; // siguiente fila después del loop
            const sumCell = sheet.getCell(`G${lastRow}`);

            // Fórmula para sumar toda la columna G
            sheet.getCell(`F${lastRow}`).value = "Total"
            sumCell.value = { formula: `SUM(G7:G${lastRow - 1})` };
            sumCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            [['A1', 'A5']].flat().forEach((cell) => Object.assign(sheet.getCell(cell), titleStyle));
            [['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2','A6','B6','C6','D6','E6','F6','G6',]].flat().forEach((cell) => Object.assign(sheet.getCell(cell), headerStyle));

            /** ARMADO DE RESUME (DEDUCTIONS Y CALCULOS ESPECIALES) */
            const sheetResume = workbook.addWorksheet('Settlement Resume', { 
                properties: { tabColor: { argb: 'FF0000' } } 
            });

            let projectGrossIncome = 0
            details.forEach((detail) =>{
                projectGrossIncome += detail.Total
            });

            let totalDeductionCapex = 0;
            let totalDeductionOpex = 0;
            deductions.forEach((deductionRow) => {
                if (deductionRow.Idtypededuction === 1) {
                    totalDeductionCapex += deductionRow.cost
                }
                if (deductionRow.Idtypededuction === 2) {
                    totalDeductionOpex += deductionRow.cost
                }
            });

            let finalUprontDeduction = totalDeductionCapex / params.rp_count;

            let totalProjectNetIncome = projectGrossIncome - finalUprontDeduction - totalDeductionOpex;

            sheetResume.getColumn(1).width = 30;
            sheetResume.getColumn(2).width = 10;
            sheetResume.getColumn(3).width = 40;
            sheetResume.getColumn(4).width = 10;
            sheetResume.getColumn(5).width = 40;
            sheetResume.getColumn(6).width = 10;

            
            sheetResume.mergeCells('A1:B1');
            sheetResume.getCell('A1').value = 'Resume';
            sheetResume.mergeCells('C1:D1');
            sheetResume.getCell('C1').value = 'Capex';
            sheetResume.mergeCells('E1:F1');
            sheetResume.getCell('E1').value = 'Opex';

            sheetResume.getCell('A2').value = 'Result';
            sheetResume.getCell('A3').value = 'Final CAPEX Approved by Assembly';
            sheetResume.getCell('A4').value = 'ERPA Recoup Capex Period';
            sheetResume.getCell('A5').value = 'Final Upfront Deduction';
            sheetResume.getCell('A6').value = 'Project Gross Income';
            sheetResume.getCell('A7').value = 'Final Annual Cost Deduction';
            sheetResume.getCell('A8').value = 'Project Net Income';

            sheetResume.getCell('B2').value = 'Total (USD)';
            sheetResume.getCell('B3').value = totalDeductionCapex;
            sheetResume.getCell('B3').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            sheetResume.getCell('B4').value = params.rp_count;

            sheetResume.getCell('B5').value = finalUprontDeduction;
            sheetResume.getCell('B5').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            sheetResume.getCell('B6').value = projectGrossIncome;
            sheetResume.getCell('B6').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            sheetResume.getCell('B7').value = totalDeductionOpex;
            sheetResume.getCell('B7').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            sheetResume.getCell('B8').value = totalProjectNetIncome;
            sheetResume.getCell('B8').numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';

            sheetResume.getCell('C2').value = 'Account';

            const capex = deductions.filter(d => d.Idtypededuction === 1);
            capex.forEach((deductionRow, index) => {
                const row = 2 + index;
                sheetResume.getCell(`C${row}`).value = deductionRow.conceptoCapex;

                const totalCell = sheetResume.getCell(`D${row}`);
                totalCell.value = deductionRow.cost;
                totalCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
            });

            if (capex.length > 0) {
                const totalRow = 2 + capex.length;
                sheetResume.getCell(`C${totalRow}`).value = 'TOTAL CAPEX';
                sheetResume.getCell(`C${totalRow}`).font = { bold: true };
                const totalCapexCell = sheetResume.getCell(`D${totalRow}`);
                totalCapexCell.value = { formula: `SUM(D2:D${totalRow - 1})` };
                totalCapexCell.font = { bold: true };
                totalCapexCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
            }

            const opex = deductions.filter(d => d.Idtypededuction === 2);
            opex.forEach((deductionRow, index) => {
                const row = 2 + index;
                sheetResume.getCell(`E${row}`).value = deductionRow.conceptoOpex;

                const totalCell = sheetResume.getCell(`F${row}`);
                totalCell.value = deductionRow.cost;
                totalCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
            });

            if (opex.length > 0) {
                const totalRow = 2 + opex.length;
                sheetResume.getCell(`E${totalRow}`).value = 'TOTAL OPEX';
                sheetResume.getCell(`E${totalRow}`).font = { bold: true };
                const totalOpexCell = sheetResume.getCell(`F${totalRow}`);
                totalOpexCell.value = { formula: `SUM(F2:F${totalRow - 1})` };
                totalOpexCell.font = { bold: true };
                totalOpexCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
            }

            [['A1', 'C1', 'E1']].flat().forEach((cell) => Object.assign(sheetResume.getCell(cell), titleStyle));

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        }
        
    } catch (error) {
        console.log(error);
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
    /** GET SETTLEMENT BY ID ROW */
    getSettlementXLSXByRegister,
}