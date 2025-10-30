const { ejecutarStoredProcedure } = require('../../queries/projects');
const { getCatalogs } = require('../../queries/catalogs');
const ExcelJS = require('exceljs');
const dotenv = require("dotenv");
dotenv.config();

/** REDIS IMPORT */
const { redisClient } = require('../../config/redisConfig');

async function getByBenefitDistribution(req, res){
    try {
      /** GENERAMOS CLAVE REDIS PARA CONSULTAR CACHE */
      const cacheKey = `${process.env.ENVIRONMENT}-ByBenefitReport-${parseInt(req.params.idprojects)}-${req.params.rpnumber}`;

      /** SE HACE LA CONSULTA DE CACHÉ, SI ENCUENTRA ALGO, ENTONCES ES LO QUE REGRESARÁ SIN NECESIDAD DE HACER TODO EL FLUJO */
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('📦 Data desde Redis');
        return res.status(200).json({ valido: 1, result: JSON.parse(cachedData) });
      }

      let benefitDistributionData = [];
      let CapexSnd
      let OpexSnd
      const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
      if(capexSigned){
        CapexSnd = capexSigned[0][0];
      }
      
      const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
      if(opexSigned){
        OpexSnd = opexSigned[0][0];
      }

      const capexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFM_BenefitDistributionAll',[parseInt(req.params.idprojects), req.params.rpnumber]);
      if(capexBenefitpgdo){
        benefitDistributionData = capexBenefitpgdo[0];
      }

      const FinalAccounts = [];
      for (const item of benefitDistributionData) {
        // Nivel 1: Tipo de cuenta (Ledger)
        let account = FinalAccounts.find(r => r.Ledger === item.Ledger);
        if (!account) {
          account = { Ledger: item.Ledger, totalPlanned: 0, totalPaid: 0, totalApproved: 0, beneficiaries: []};
          FinalAccounts.push(account);
        }

        // Nivel 2: Tipo de beneficiario
        let beneficiary = account.beneficiaries.find(b => b.Type_of_Beneficiary === item.Type_of_Beneficiary);
        if (!beneficiary) {
          beneficiary = { Type_of_Beneficiary: item.Type_of_Beneficiary, totalPlanned: 0, totalPaid: 0, suppliers: []};
          account.beneficiaries.push(beneficiary);
        }

        // Nivel 3: Tipo de proveedor
        let supplier = beneficiary.suppliers.find(s => s.Type_of_Supplier === item.Type_of_Supplier);
        if (!supplier) {
          supplier = { Type_of_Supplier: item.Type_of_Supplier, totalPlanned: 0, totalPaid: 0, items: []};
          beneficiary.suppliers.push(supplier);
        }

        // Agregar el item al último nivel
        supplier.items.push(item);

        // Sumamos montos en todos los niveles
        // por proveedor
        supplier.totalPlanned += item.EstimadoUSD || 0;
        supplier.totalPaid += item.Amount_USD || 0;
        // por beneficiario
        beneficiary.totalPlanned += item.EstimadoUSD || 0;
        beneficiary.totalPaid += item.Amount_USD || 0;
        // por tipo de cuenta + lo firmado
        account.totalPlanned += item.EstimadoUSD || 0;
        account.totalPaid += item.Amount_USD || 0;
        account.totalApproved = item.Ledger === 'Capex' ? (CapexSnd?.total || 0) : (OpexSnd?.valor || 0);
      }

    // await redisClient.set(cacheKey, JSON.stringify(FinalAccounts), { EX: 20 });
    res.status(201).json({valido: 1, result: FinalAccounts});
  } catch (error) {
    console.log(error);
  }
  }
  
  function getByBenefitDistributionXLSX(req, res){
    return new Promise(async function (resolve, reject){

      let benefitDistributionData = [];
      let CapexSnd
      let OpexSnd
      const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(req.params.idprojects)]);
      if(capexSigned){
        CapexSnd = capexSigned[0][0];
      }
      
      const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[req.params.rpnumber, parseInt(req.params.idprojects)]);
      if(opexSigned){
        OpexSnd = opexSigned[0][0];
      }

      const capexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFM_BenefitDistributionAll',[parseInt(req.params.idprojects), req.params.rpnumber]);
      if(capexBenefitpgdo){
        benefitDistributionData = capexBenefitpgdo[0];
      }

      const FinalAccounts = [];
      for (const item of benefitDistributionData) {
        // Nivel 1: Tipo de cuenta (Ledger)
        let account = FinalAccounts.find(r => r.Ledger === item.Ledger);
        if (!account) {
          account = { Ledger: item.Ledger, totalPlanned: 0, totalPaid: 0, totalApproved: 0, beneficiaries: []};
          FinalAccounts.push(account);
        }

        // Nivel 2: Tipo de beneficiario
        let beneficiary = account.beneficiaries.find(b => b.Type_of_Beneficiary === item.Type_of_Beneficiary);
        if (!beneficiary) {
          beneficiary = { Type_of_Beneficiary: item.Type_of_Beneficiary, totalPlanned: 0, totalPaid: 0, suppliers: []};
          account.beneficiaries.push(beneficiary);
        }

        // Nivel 3: Tipo de proveedor
        let supplier = beneficiary.suppliers.find(s => s.Type_of_Supplier === item.Type_of_Supplier);
        if (!supplier) {
          supplier = { Type_of_Supplier: item.Type_of_Supplier, totalPlanned: 0, totalPaid: 0, items: []};
          beneficiary.suppliers.push(supplier);
        }

        // Agregar el item al último nivel
        supplier.items.push(item);

        // Sumamos montos en todos los niveles
        // por proveedor
        supplier.totalPlanned += item.EstimadoUSD || 0;
        supplier.totalPaid += item.Amount_USD || 0;
        // por beneficiario
        beneficiary.totalPlanned += item.EstimadoUSD || 0;
        beneficiary.totalPaid += item.Amount_USD || 0;
        // por tipo de cuenta + lo firmado
        account.totalPlanned += item.EstimadoUSD || 0;
        account.totalPaid += item.Amount_USD || 0;
        account.totalApproved = item.Ledger === 'Capex' ? (CapexSnd?.total || 0) : (OpexSnd?.valor || 0);
      }
      // Creación de libro de excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('By Benefit Tracker', {
        properties: { tabColor: { argb: 'FF0000' } }
      });

      // Definir columnas
      sheet.columns = [
        { header: 'Account Type (Ledger)', key: 'ledger', width: 20 },
        { header: 'Beneficiary Type', key: 'beneficiary', width: 30 },
        { header: 'Supplier Type', key: 'supplier', width: 30 },
        { header: 'Concept / Description', key: 'concept', width: 50 },
        { header: 'Approved', key: 'approved', width: 18, style: { numFmt: '"$"#,##0.00' } },
        { header: 'Planned', key: 'planned', width: 18, style: { numFmt: '"$"#,##0.00' } },
        { header: 'Paid', key: 'paid', width: 18, style: { numFmt: '"$"#,##0.00' } },
      ];

      // Congelar fila de encabezado
      sheet.views = [{ state: 'frozen', ySplit: 1 }];

      // Estilos de encabezado
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

      // Recorrer estructura jerárquica
      FinalAccounts.forEach(account => {
        // 🟢 Nivel 1 - Ledger
        const ledgerRow = sheet.addRow({
          ledger: account.Ledger,
          approved: account.totalApproved,
          planned: account.totalPlanned,
          paid: account.totalPaid,
        });
        ledgerRow.getCell('ledger').font = { bold: true };
        ledgerRow.getCell('approved').font = { bold: true };
        ledgerRow.getCell('planned').font = { bold: true };
        ledgerRow.getCell('paid').font = { bold: true };

        // 🟡 Nivel 2 - Beneficiario
        if (account.beneficiaries?.length > 0) {
          account.beneficiaries.forEach(beneficiary => {
            const beneficiaryRow = sheet.addRow({
              beneficiary: beneficiary.Type_of_Beneficiary,
              planned: beneficiary.totalPlanned,
              paid: beneficiary.totalPaid,
            });
            beneficiaryRow.getCell('beneficiary').font = { bold: true };
            beneficiaryRow.getCell('planned').font = { bold: true };
            beneficiaryRow.getCell('paid').font = { bold: true };

            // 🟠 Nivel 3 - Proveedor
            if (beneficiary.suppliers?.length > 0) {
              beneficiary.suppliers.forEach(supplier => {
                const supplierRow = sheet.addRow({
                  supplier: supplier.Type_of_Supplier,
                  planned: supplier.totalPlanned,
                  paid: supplier.totalPaid,
                });
                supplierRow.getCell('supplier').font = { bold: true };
                supplierRow.getCell('planned').font = { bold: true };
                supplierRow.getCell('paid').font = { bold: true };

                // 🔵 Nivel 4 - Items (detalle)
                if (supplier.items?.length > 0) {
                  supplier.items.forEach(item => {
                    sheet.addRow({
                      concept: item.concepto_subaccount || '', // ajusta según tu campo real
                      planned: item.EstimadoUSD || 0,
                      paid: item.Amount_USD || 0,
                    });
                  });
                }
              });
            }
          });
        }

        // Agregamos una fila en blanco para separar cuentas
        sheet.addRow({});
      });

      // Ajustar bordes opcionalmente
      // sheet.eachRow({ includeEmpty: false }, row => {
      //   row.eachCell({ includeEmpty: true }, cell => {
      //     cell.border = {
      //       top: { style: 'thin' },
      //       left: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });
      // });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);
  
    await workbook.xlsx.write(res);
    res.end();
  
    })
  }

async function getByBenefitDistributionByFullReport(idProject, rpnumbers){
  try {
      let benefitDistributionData = [];
      let CapexSnd
      let OpexSnd
      const capexSigned = await ejecutarStoredProcedure('sp_GetFirmadoCapexByProyecto',[parseInt(idProject)]);
      if(capexSigned){
        CapexSnd = capexSigned[0][0];
      }
      
      const opexSigned = await ejecutarStoredProcedure('sp_GetFirmadoOpexGroupedByRpnumber',[rpnumbers, parseInt(idProject)]);
      if(opexSigned){
        OpexSnd = opexSigned[0][0];
      }

      const capexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFM_BenefitDistributionAll',[parseInt(idProject), rpnumbers]);
      if(capexBenefitpgdo){
        benefitDistributionData = capexBenefitpgdo[0];
      }

      const FinalAccounts = [];
      for (const item of benefitDistributionData) {
        // Nivel 1: Tipo de cuenta (Ledger)
        let account = FinalAccounts.find(r => r.Ledger === item.Ledger);
        if (!account) {
          account = { Ledger: item.Ledger, totalPlanned: 0, totalPaid: 0, totalApproved: 0, beneficiaries: []};
          FinalAccounts.push(account);
        }

        // Nivel 2: Tipo de beneficiario
        let beneficiary = account.beneficiaries.find(b => b.Type_of_Beneficiary === item.Type_of_Beneficiary);
        if (!beneficiary) {
          beneficiary = { Type_of_Beneficiary: item.Type_of_Beneficiary, totalPlanned: 0, totalPaid: 0, suppliers: []};
          account.beneficiaries.push(beneficiary);
        }

        // Nivel 3: Tipo de proveedor
        let supplier = beneficiary.suppliers.find(s => s.Type_of_Supplier === item.Type_of_Supplier);
        if (!supplier) {
          supplier = { Type_of_Supplier: item.Type_of_Supplier, totalPlanned: 0, totalPaid: 0, items: []};
          beneficiary.suppliers.push(supplier);
        }

        // Agregar el item al último nivel
        supplier.items.push(item);

        // Sumamos montos en todos los niveles
        // por proveedor
        supplier.totalPlanned += item.EstimadoUSD || 0;
        supplier.totalPaid += item.Amount_USD || 0;
        // por beneficiario
        beneficiary.totalPlanned += item.EstimadoUSD || 0;
        beneficiary.totalPaid += item.Amount_USD || 0;
        // por tipo de cuenta + lo firmado
        account.totalPlanned += item.EstimadoUSD || 0;
        account.totalPaid += item.Amount_USD || 0;
        account.totalApproved = item.Ledger === 'Capex' ? (CapexSnd?.total || 0) : (OpexSnd?.valor || 0);
      }

      return FinalAccounts;
  } catch (error) {
    console.log(error);
     
  }
}

module.exports = {
    getByBenefitDistribution,
    getByBenefitDistributionXLSX,
    /** function full report */
    getByBenefitDistributionByFullReport
}