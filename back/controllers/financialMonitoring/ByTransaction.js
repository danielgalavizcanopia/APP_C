const { ejecutarStoredProcedure } = require('../../queries/projects');
const ExcelJS = require('exceljs');
const dotenv = require("dotenv");

dotenv.config();

/** REDIS IMPORT */
const { redisClient } = require('../../config/redisConfig');
const { ejecutarVistaTools } = require('../../queries/executeViews');

async function getTransactionTracker(req, res) {
    try {

        /** GENERAMOS CLAVE REDIS PARA CONSULTAR CACHE */
        const cacheKey = `${process.env.ENVIRONMENT}-ByTransactionReport-${parseInt(req.params.idprojects)}-${req.params.rpnumber}`;

        /** SE HACE LA CONSULTA DE CACHÉ, SI ENCUENTRA ALGO, ENTONCES ES LO QUE REGRESARÁ SIN NECESIDAD DE HACER TODO EL FLUJO */
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          console.log('📦 Data desde Redis');
          return res.status(200).json({ valido: 1, result: JSON.parse(cachedData) });
        }

        let transactions = [];
        const transaction = await ejecutarStoredProcedure('sp_GetTransaction', [parseInt(req.params.idprojects), req.params.rpnumber]);
        if( transaction && transaction.length > 0) {
            transactions = transaction[0];
        }

        let CapexAccounts = [];
        let totalCapex = 0;

        let OpexAccounts = [];
        let totalOpex = 0;

        for(let i = 0; i < transactions.length; i++) {
            const transactionItem = transactions[i];

            if(transactionItem.Ledger === 'Capex') {
                CapexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.capexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentacapex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Created,
                    recipient: transactionItem.Recipient
                });

                totalCapex += parseFloat(transactionItem.Amount_USD);
            }

            if(transactionItem.Ledger === 'Opex' || transactionItem.Ledger === 'opex') {
                OpexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.opexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentaopex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Created,
                    recipient: transactionItem.Recipient
                });

                totalOpex += parseFloat(transactionItem.Amount_USD);
            }
        }

        const FinalAccounts = [
            {
                id:1,
                accountType: 'Capex',
                total: totalCapex,
                accounts: CapexAccounts
            },
            {
                id:2,
                accountType: 'Opex',
                total: totalOpex,
                accounts: OpexAccounts
            }
        ]

        await redisClient.set(cacheKey, JSON.stringify(FinalAccounts), { EX: 20 });
        res.status(200).json({ valido: 1, result: FinalAccounts });
    } catch (error) {
        res.status(500).json({ valido: 0, error: error.message });
    }
}

async function getTransactionTrackerXLSX(req, res) {
    try {
        let transactions = [];
        const transaction = await ejecutarStoredProcedure('sp_GetTransaction', [parseInt(req.params.idprojects), req.params.rpnumber]);
        if( transaction && transaction.length > 0) {
            transactions = transaction[0];
        }

        let CapexAccounts = [];
        let totalCapex = 0;

        let OpexAccounts = [];
        let totalOpex = 0;

        for(let i = 0; i < transactions.length; i++) {
            const transactionItem = transactions[i];

            if(transactionItem.Ledger === 'Capex') {
                CapexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.capexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentacapex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Payment_Date,
                    recipient: transactionItem.Recipient,
                    Payment_Year: transactionItem.Payment_Year,
                    Payment_Month: transactionItem.Payment_Month,
                });

                totalCapex += parseFloat(transactionItem.Amount_USD);
            }

            if(transactionItem.Ledger === 'Opex' || transactionItem.Ledger === 'opex') {
                OpexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.opexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentaopex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Payment_Date,
                    recipient: transactionItem.Recipient,
                    Payment_Year: transactionItem.Payment_Year,
                    Payment_Month: transactionItem.Payment_Month,
                });

                totalOpex += parseFloat(transactionItem.Amount_USD);
            }
        }

        const FinalAccounts = [
            {
                id:1,
                accountType: 'Capex',
                total: totalCapex,
                accounts: CapexAccounts
            },
            {
                id:2,
                accountType: 'Opex',
                total: totalOpex,
                accounts: OpexAccounts
            }
        ]

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('By Transaction Tracker', {
        properties: { tabColor: { argb: 'FF0000' } }
        });

        sheet.columns = [
            { header: 'ID', key: 'id', width: 5 },
            { header: 'Ledger', key: 'accountType', width: 10 },
            { header: 'SubAccount', key: 'accountName', width: 50 },
            { header: 'Type of supplier', key: 'typeofSupplier', width: 25 },
            { header: 'Type of beneficiary', key: 'typeofBeneficiary', width: 30 },
            { header: 'Recipient', key: 'recipient', width: 25 },
            { header: 'Actual Ledger', key: 'Amount_USD', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Payment Date', key: 'createdAt', width: 18 },
            { header: 'Payment Year', key: 'Payment_Year', width: 18 },
            { header: 'Payment Month', key: 'Payment_Month', width: 18 },
            { header: 'RP', key: 'idrpnumber', width: 5 },

        ];

        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        function printActivities(sheet, accounts, startRow, ledger) {
            let currentRow = startRow;
          
            accounts.forEach((account) => {
              sheet.getRow(currentRow).getCell(2).value = ledger;
              sheet.getRow(currentRow).getCell(3).value = account.accountName;
              sheet.getRow(currentRow).getCell(4).value = account.typeofSupplier;
              sheet.getRow(currentRow).getCell(5).value = account.typeofBeneficiary;
              sheet.getRow(currentRow).getCell(6).value = account.recipient;
              sheet.getRow(currentRow).getCell(7).value = account.Amount_USD;
              sheet.getRow(currentRow).getCell(8).value = account.createdAt;
              sheet.getRow(currentRow).getCell(9).value = account.Payment_Year;
              sheet.getRow(currentRow).getCell(10).value = account.Payment_Month;
              sheet.getRow(currentRow).getCell(11).value = account.idrpnumber;
            //   sheet.getRow(currentRow).getCell(11).value = account.recipient;
              currentRow++; // importante para evitar sobrescribir
            });
          
            return currentRow;
        }
          
        let currentRow = 2;
          
        FinalAccounts.forEach((item) => {
            const newRow = sheet.addRow({
                id: item.id,
                accountType: item.accountType,
            });

            newRow.getCell('accountType').font = { bold: true };
            
            currentRow++;
            
            if (item.accounts && item.accounts.length > 0) {
                currentRow = printActivities(sheet, item.accounts, currentRow, item.accountType);
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
    } catch (error) {
        res.status(500).json({ valido: 0, error: error.message });
    }
}

async function getByTransactionByAllReportXLSX(req, res) {
    try {
        const resultados = await ejecutarVistaTools('vw_reporte_general_transaction');
        
        if(!resultados || resultados.length === 0) {
            return res.status(404).json({valido: 0, message: 'No hay datos disponibles'});
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('By Transaction', {
            properties: { tabColor: { argb: 'FF0000' } }
        });

        sheet.columns = [
            { header: 'Ledger', key: 'Ledger', width: 10 },
            { header: 'Cta', key: 'Cta', width: 55 },
            { header: 'Project', key: 'Proyecto', width: 35 },
            { header: 'Type of Supplier', key: 'Type_of_Supplier', width: 30 },
            { header: 'Type of Beneficiary', key: 'Type_of_Beneficiary', width: 30 },
            { header: 'Recipient', key: 'Recipient', width: 15 },
            { header: 'Amount (USD)', key: 'Amount_USD', width: 15 },
            { header: 'Payment Date', key: 'Payment_Date', width: 15 },
            { header: 'Payment Year', key: 'Payment_Year', width: 15 },
            { header: 'Payment Month', key: 'Payment_Month', width: 15 },
            { header: 'RP', key: 'RP', width: 10 }
        ];

        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${month}/${day}/${year}`;
        };

        const getMonthName = (monthNumber) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[monthNumber - 1] || '';
        };

        resultados.forEach((item) => {

            const row = sheet.addRow({
                Ledger: item.Ledger,
                Cta: item.Cta_Cost_Description,
                Proyecto: item.Proyecto,
                Type_of_Supplier: item.typeofSupplier,
                Type_of_Beneficiary: item.typeofBeneficiary,
                Recipient: item.Recipient,
                Amount_USD: item.Amount_USD,
                Payment_Date: formatDate(item.Payment_Date),
                Payment_Year: item.Payment_Year,
                Payment_Month: getMonthName(item.Payment_Month),
                RP: item.idrpnumber
            });

            row.getCell(8).numFmt = '"$"#,##0.00';
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
        res.setHeader('Content-Disposition', 'attachment; filename=_ByTransactionReport.xlsx');

        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Error en getByTransactionByAllReportXLSX:', error);
        res.status(500).json({valido: 0, error: error.message});
    }
}

async function getByTransactionByFullReport(idProject, rpnumbers){
    try {
        let transactions = [];
        const transaction = await ejecutarStoredProcedure('sp_GetTransaction', [parseInt(idProject), rpnumbers]);
        if( transaction && transaction.length > 0) {
            transactions = transaction[0];
        }

        let CapexAccounts = [];
        let totalCapex = 0;

        let OpexAccounts = [];
        let totalOpex = 0;

        for(let i = 0; i < transactions.length; i++) {
            const transactionItem = transactions[i];

            if(transactionItem.Ledger === 'Capex') {
                CapexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.capexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentacapex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Created,
                    // recipient: transactionItem.Recipient
                });

                totalCapex += parseFloat(transactionItem.Amount_USD);
            }

            if(transactionItem.Ledger === 'Opex' || transactionItem.Ledger === 'opex') {
                OpexAccounts.push({
                    idrpnumber: transactionItem.idrpnumber,
                    principalAccount: transactionItem.opexaccounts,
                    idTransaction: transactionItem.IdP_R_Estructurada,
                    accountName: transactionItem.subcuentaopex,
                    Actividad: transactionItem.Actividad,
                    typeofBeneficiary: transactionItem.typeofBeneficiary,
                    typeofSupplier: transactionItem.typeofSupplier,
                    Amount_USD: transactionItem.Amount_USD,
                    createdAt: transactionItem.Created,
                    // recipient: transactionItem.Recipient
                });

                totalOpex += parseFloat(transactionItem.Amount_USD);
            }
        }

        const FinalAccounts = [
            {
                id:1,
                accountType: 'Capex',
                total: totalCapex,
                accounts: CapexAccounts
            },
            {
                id:2,
                accountType: 'Opex',
                total: totalOpex,
                accounts: OpexAccounts
            }
        ]
        
        return FinalAccounts;
    } catch (error) {
        
    }
}
async function getByTransactionByAllReport(req, res){
    try {
        const resultados = await ejecutarVistaTools('vw_reporte_general_transaction');
        if(resultados){
            res.status(200).json({valido: 1, result: resultados});
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getTransactionTracker,
    getTransactionTrackerXLSX,
    getByTransactionByFullReport,
    getByTransactionByAllReport,
    getByTransactionByAllReportXLSX  
};