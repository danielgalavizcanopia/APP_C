const { ejecutarStoredProcedure } = require('../../queries/projects');
const ExcelJS = require('exceljs');
const dotenv = require("dotenv");
dotenv.config();

/** REDIS IMPORT */
const { redisClient } = require('../../config/redisConfig');

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

        const workbook = new ExcelJS.Workbook();
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

        function printActivities(sheet, accounts, startRow, ledger) {
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

module.exports = {
    getTransactionTracker,
    getTransactionTrackerXLSX,
    /** function full final report */
    getByTransactionByFullReport,
};