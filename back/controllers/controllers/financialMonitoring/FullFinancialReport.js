const ExcelJS = require('exceljs');

const { getByAccountByFullReport } = require('./ByAccounts');
const { getByActivitiesByFullReport } = require('./ByActivities');
const { getByBenefitDistributionByFullReport } = require('./ByBenefitD');
const { getByTransactionByFullReport } = require('./ByTransaction');

const { ejecutarStoredProcedure } = require('../../queries/projects')

async function getRangeRPByDates(req, res){
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetDateRangeByRPList',[parseInt(req.params.idprojects), req.params.rpnumber ]);
        if(resultados.length > 0){
          res.status(201).json({valido: 1, result: resultados[0]});
        }
    } catch (error) {
        
    }
}

async function getFullFinancialMonitoringReport(req, res){
    try {
        const byaccounts =  await getByAccountByFullReport(parseInt(req.params.idprojects), req.params.rpnumber);
        const byactivities =  await getByActivitiesByFullReport(parseInt(req.params.idprojects), req.params.rpnumber);
        const bybenefit =  await getByBenefitDistributionByFullReport(parseInt(req.params.idprojects), req.params.rpnumber);
        const bytransaction =  await getByTransactionByFullReport(parseInt(req.params.idprojects), req.params.rpnumber);

        if(byaccounts && byactivities && bybenefit && bytransaction){
            const workbook = new ExcelJS.Workbook();
            /** BY ACCOUNTS TRACKER */
            const sheetFinancial = workbook.addWorksheet('By Accounts', {
            properties: { tabColor: { argb: 'FF0000' } }
            });

            sheetFinancial.columns = [
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

            sheetFinancial.views = [{ state: 'frozen', ySplit: 1 }];

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

            /** consumo de byAccounts */
            let currentRow = 2;
            byaccounts.forEach((item) => {
            const newRow = sheetFinancial.addRow({
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
                currentRow = printAccounts(sheetFinancial, item.Accounts, currentRow + 1);
            } else {
                currentRow++;
            }
            });

            sheetFinancial.getRow(1).eachCell(cell => {
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
            /** BY ACTIVITIES TRACKER */
            const sheetActivities = workbook.addWorksheet('By Activities Tracker', {
            properties: { tabColor: { argb: 'FF0000' } }
            });

            sheetActivities.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Nombre', key: 'Name', width: 15 },
            { header: 'Activity', key: 'ActivityName', width: 115 },
            { header: 'Aprobado', key: 'Approved', width: 15, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Planeado', key: 'Planned', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Pagado', key: 'Paid', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Provisional', key: 'Provisional', width: 20, style: { numFmt: '"$"#,##0.00' } }
            ];

            sheetActivities.views = [{ state: 'frozen', ySplit: 1 }];

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
            
            let currentRowActivities = 2;
            
            byactivities.forEach((item) => {
            const newRow = sheetActivities.addRow({
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
            
            currentRowActivities++;
            
            if (item.Accounts && item.Accounts.length > 0) {
                currentRowActivities = printActivities(sheetActivities, item.Accounts, currentRowActivities);
            }
            });

            sheetActivities.getRow(1).eachCell(cell => {
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
            /** BY BENEFIT DISTRIBUTION TRACKER */
            const sheetBenefit = workbook.addWorksheet('Benefit Distribution Tracker', {
                properties: { tabColor: { argb: 'FF0000' } }
            });
            
            sheetBenefit.columns = [
                { header: 'Accounts', key: 'Name', width: 20 },
                { header: 'By beneficiary', key: 'name', width: 35 },,
                { header: 'Type', key: 'Type', width: 35 },
                { header: 'Account', key: 'concept', width: 60 },
                { header: 'Approved', key: 'approved', width: 18, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Planned', key: 'planned', width: 18, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Paid', key: 'paid', width: 18, style: { numFmt: '"$"#,##0.00' } },
            ];
            
            sheetBenefit.views = [{ state: 'frozen', ySplit: 1 }];
            
            sheetBenefit.getRow(1).eachCell(cell => {
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
            
            bybenefit.forEach(item => {
                const newRow = sheetBenefit.addRow({
                Name: item.Name,
                approved: item.Approved,
                planned: item.Planned,
                paid: item.Paid,
                });
        
                newRow.getCell('Name').font = { bold: true };
                newRow.getCell('approved').font = { bold: true };
                newRow.getCell('planned').font = { bold: true };
                newRow.getCell('paid').font = { bold: true };
                if (item.Accounts && item.Accounts.length > 0) {
                    item.Accounts.forEach(sub => {
                    const newRow = sheetBenefit.addRow({
                        name: sub.name,
                        planned: sub.totalPlanned,
                        paid: sub.totalPaid,
                    });
        
                    newRow.getCell('name').font = { bold: true };
                    newRow.getCell('planned').font = { bold: true };
                    newRow.getCell('paid').font = { bold: true };
        
                    if (sub.rows && sub.rows.length > 0) {
                        sub.rows.forEach(row => {
                        const newRow = sheetBenefit.addRow({
                                name: row.name,
                                planned: row.totalPlanned,
                                paid: row.totalPaid,
                            });
        
                            if (row.rows && row.rows.length > 0) {
                                row.rows.forEach(subrow => {                      
                                const newRow = sheetBenefit.addRow({
                                    Type: subrow.Type,
                                    concept: subrow.concept,
                                    planned: subrow.planned,
                                    paid: subrow.paid,
                                });
        
                                })
            
                            }
                        });
                    }
                    });
                }
            });
            /** BY TRANSACTION */
            const sheet = workbook.addWorksheet('By Transaction Tracker', {
                properties: { tabColor: { argb: 'FF0000' } }
            });

            sheet.columns = [
                { header: 'ID', key: 'id', width: 5 },
                { header: 'Ledger', key: 'accountType', width: 10 },
                { header: 'SubAccount', key: 'accountName', width: 50 },
                /** PROJECTNAME */
                { header: 'Type of supplier', key: 'typeofSupplier', width: 25 },
                { header: 'Type of beneficiary', key: 'typeofBeneficiary', width: 30 },
                { header: 'Actual Ledger', key: 'Amount_USD', width: 20, style: { numFmt: '"$"#,##0.00' } },
                { header: 'Payment Date', key: 'createdAt', width: 18 },
            ];

            sheet.views = [{ state: 'frozen', ySplit: 1 }];

            function printTransactions(sheet, accounts, startRow, ledger) {
                let currentRow = startRow;
            
                accounts.forEach((account) => {
                sheet.getRow(currentRow).getCell(2).value = ledger;
                sheet.getRow(currentRow).getCell(3).value = account.accountName;
                /** PROJECTNAME */
                sheet.getRow(currentRow).getCell(4).value = account.typeofSupplier;
                sheet.getRow(currentRow).getCell(5).value = account.typeofBeneficiary;
                sheet.getRow(currentRow).getCell(6).value = account.Amount_USD;
                sheet.getRow(currentRow).getCell(7).value = account.createdAt;
                //   sheet.getRow(currentRow).getCell(11).value = account.recipient;
                currentRow++; // importante para evitar sobrescribir
                });
            
                return currentRow;
            }
            
            let currentRowTransaction = 2;
            
            bytransaction.forEach((item) => {
                const newRow = sheet.addRow({
                    id: item.id,
                    accountType: item.accountType,
                });

                newRow.getCell('accountType').font = { bold: true };
                
                currentRowTransaction++;
                
                if (item.accounts && item.accounts.length > 0) {
                    currentRowTransaction = printTransactions(sheet, item.accounts, currentRowTransaction, item.accountType);
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
            res.setHeader('Content-Disposition', `attachment; filename=FullReport.xlsx`);
    
            await workbook.xlsx.write(res);
            res.end();
        }


    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getFullFinancialMonitoringReport,
    getRangeRPByDates
}
