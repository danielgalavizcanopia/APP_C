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
        let PlannedAccounts = [];
  
        let capexBenefitPaid = [];
        let opexBenefitPaid = [];
  
        let typeSupplierCt = [];
        let typeBenefitCt = [];

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
  
        const plannedAccounts = await ejecutarStoredProcedure('sp_GetPlannedBenefitbyprojectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(plannedAccounts){
          PlannedAccounts = plannedAccounts[0];
        }
  
        const capexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFinCapexTypeBenefByRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(capexBenefitpgdo){
          capexBenefitPaid = capexBenefitpgdo[0];
        }
        const opexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFinOpexTypeBenefByRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(opexBenefitpgdo){
          opexBenefitPaid = opexBenefitpgdo[0];
        }
  
        const typeBenefit = await getCatalogs('ct_TypeofBeneficiary');
        if(typeBenefit.length > 0){
          typeBenefitCt = typeBenefit;
        }
  
        const typeSupplier = await getCatalogs('ct_typeofsupplier');
        if(typeSupplier.length > 0){
          typeSupplierCt = typeSupplier;
        }
  
  
      var BenefitsRow = [];
      for(let i=0;i<typeBenefitCt.length;i++){
        let ben = typeBenefitCt[i];
        var supplierRow = [];
        for(let j=0;j<typeSupplierCt.length;j++){
          let supplier = typeSupplierCt[j];
          var Rows = [];
          totalPlanned = 0;
          total = 0;
          if(supplier.Status == ben.IdtypeofBeneficiary){
            for(let x=0;x<capexBenefitPaid.length;x++) {
              let rowCapex = capexBenefitPaid[x]
              if(rowCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){

                let plannedRow;
                plannedRow = PlannedAccounts.find(x => x.LedgerType == "CAPEX" && x.idcapexsubaccount == rowCapex.idcapexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdtypeofSupplier == rowCapex.IdtypeofSupplier)
                
                const existingDuplicate = Rows.find(x => x.idactivitiesprojects === plannedRow?.idactivitiesprojects && x.idrpnumber === plannedRow?.idrpnumber && x.idcapexsubaccount === plannedRow?.idcapexsubaccount && x.IdActividaddata === plannedRow?.IdActividaddata)
                if(existingDuplicate){
                  plannedRow = PlannedAccounts.find(x =>  x.LedgerType == "CAPEX" && x.idcapexsubaccount == rowCapex.idcapexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdActividaddata != existingDuplicate.IdActividaddata)
                }
                Rows.push({
                  id: x,
                  Type: rowCapex.Type_of_Supplier,
                  idactivitiesprojects: rowCapex.idactivitiesprojects,
                  idrpnumber: rowCapex.idrpnumber,
                  idcapexsubaccount: rowCapex.idcapexsubaccount,
                  activity: plannedRow ? plannedRow.Actividad : '', // '',
                  IdActividaddata: plannedRow?.IdActividaddata || 0,
                  concept: rowCapex.capexconcepto,
                  planned: plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, // 0,
                  paid: rowCapex.Amount_USD
                })
                totalPlanned +=  plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, //0
                total += rowCapex.Amount_USD
              }
            }
            
            for(let planned=0;planned<PlannedAccounts.length;planned++){
              let plannedCapex = PlannedAccounts[planned];
              if(plannedCapex.LedgerType == "CAPEX"){
                if(plannedCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                  let existingCapexPaid = Rows.find(x => x.IdActividaddata === plannedCapex.IdActividaddata || x.IdActividaddata === plannedCapex.IdActividaddata && x.idcapexsubaccount == plannedCapex.idcapexsubaccount && x.idactivitiesprojects == plannedCapex.idactivitiesprojects && x.idrpnumber == plannedCapex.idrpnumber)
                  if(!existingCapexPaid){
                    Rows.push({
                      id: planned,
                      Type: plannedCapex.Supplier,
                      idrpnumber: plannedCapex.idrpnumber,
                      idcapexsubaccount: plannedCapex.idcapexsubaccount,
                      idactivitiesprojects: plannedCapex.idactivitiesprojects,
                      activity: plannedCapex.Actividad, // '',
                      concept: plannedCapex.CapexConcept,
                      planned: plannedCapex.EstimadoUSD, // 0,
                      paid: 0
                    })
                    totalPlanned += parseFloat(plannedCapex.EstimadoUSD);
                  }
                }
              }
            }

            /** */
            supplierRow.push({
              id:j,
              name: supplier.ShortDescription,
              totalPlanned: totalPlanned,
              totalPaid: total,
              rows: Rows,
            })
          }
        }
  
        let sumaTotalPlanned = 0;
        let sumaTotal = 0;
        for(let sum of supplierRow){
          sumaTotalPlanned += sum.totalPlanned;
          sumaTotal += sum.totalPaid;
        }
        
        BenefitsRow.push({
          id: i,
          name: ben.ShortDescription,
          totalPlanned: sumaTotalPlanned,
          totalPaid: sumaTotal,
          rows: supplierRow,
        });
      }
  
      /** OPEX ARMADO */
      var BenefitsRowOpex = [];
      for(let i=0;i<typeBenefitCt.length;i++){
        let ben = typeBenefitCt[i];
        var supplierRow = [];
        for(let j=0;j<typeSupplierCt.length;j++){
          let supplier = typeSupplierCt[j];
          var Rows = [];
          totalPlanned = 0;
          total = 0;
          if(supplier.Status == ben.IdtypeofBeneficiary){
            for(let x=0;x<opexBenefitPaid.length;x++) {
              let rowCapex = opexBenefitPaid[x]
              if(rowCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                let plannedRow;
                plannedRow = PlannedAccounts.find(x => x.LedgerType == "OPEX" && x.idopexsubaccount == rowCapex.idopexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdtypeofSupplier == rowCapex.IdtypeofSupplier)
                
                const existingDuplicate = Rows.find(x => x.idactivitiesprojects === plannedRow?.idactivitiesprojects && x.idrpnumber === plannedRow?.idrpnumber && x.idopexsubaccount === plannedRow?.idopexsubaccount && x.IdActividaddata === plannedRow?.IdActividaddata)
                if(existingDuplicate){
                  plannedRow = PlannedAccounts.find(x => x.LedgerType == "OPEX" && x.idopexsubaccount == rowCapex.idopexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdActividaddata != existingDuplicate.IdActividaddata)
                }

                Rows.push({
                  id: x,
                  Type: rowCapex.Type_of_Supplier,
                  idactivitiesprojects: rowCapex.idactivitiesprojects,
                  idopexsubaccount: rowCapex.idopexsubaccount,
                  idrpnumber: rowCapex.idrpnumber,
                  IdActividaddata: plannedRow?.IdActividaddata || 0,
                  activity: plannedRow ? plannedRow.Actividad : '', //'',
                  concept: rowCapex.Opexconcepto,
                  planned: plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, //0,
                  paid: rowCapex.Amount_USD
                })
                totalPlanned += plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0 //0
                total += rowCapex.Amount_USD
              }
            }

            for(let planned=0;planned<PlannedAccounts.length;planned++){
              let plannedCapex = PlannedAccounts[planned];
              if(plannedCapex.LedgerType == "OPEX"){
                if(plannedCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                  let existingCapexPaid = Rows.find(x => x.IdActividaddata === plannedCapex.IdActividaddata || x.IdActividaddata === plannedCapex.IdActividaddata && x.idopexsubaccount == plannedCapex.idopexsubaccount && x.idactivitiesprojects == plannedCapex.idactivitiesprojects && x.idrpnumber == plannedCapex.idrpnumber)
                  if(!existingCapexPaid){
                    Rows.push({
                      id: planned,
                      Type: plannedCapex.Supplier,
                      idrpnumber: plannedCapex.idrpnumber,
                      idopexsubaccount: plannedCapex.idopexsubaccount,
                      idactivitiesprojects: plannedCapex.idactivitiesprojects,
                      activity: plannedCapex.Actividad, // '',
                      concept: plannedCapex.OpexConcept,
                      planned: plannedCapex.EstimadoUSD, // 0,
                      paid: 0
                    })
                    totalPlanned += parseFloat(plannedCapex.EstimadoUSD);
                  }
                }
              }
            }
            supplierRow.push({
              id:j,
              name: supplier.ShortDescription,
              totalPlanned: totalPlanned,
              totalPaid: total,
              rows: Rows,
            })
          }
        }
  
        let sumaTotal = 0;
        let sumaTotalP = 0;
        for(let sum of supplierRow){
          sumaTotalP += sum.totalPlanned;
          sumaTotal += sum.totalPaid;
        }
        
        BenefitsRowOpex.push({
          id:i,
          name: ben.ShortDescription,
          totalPlanned: sumaTotalP,
          totalPaid: sumaTotal,
          rows: supplierRow,
        });
      }
  
      let sumaCapex = 0;
      let sumaPCapex = 0;
      let sumaOpex = 0;
      let sumaPOpex = 0;
  
      for(let sum of BenefitsRow){
        sumaPCapex += sum.totalPlanned;
        sumaCapex += sum.totalPaid;
      }
  
      for(let sum of BenefitsRowOpex){
        sumaPOpex += sum.totalPlanned
        sumaOpex += sum.totalPaid;
      }
  
      let FinalAccounts = [
        {
          id: 1,
          Name: 'Capex Accounts',
          Approved: CapexSnd?.total,
          Planned: sumaPCapex,
          Paid: sumaCapex,
          Accounts: BenefitsRow
        },
        {
          id: 2,
          Name: 'Opex Accounts',
          Approved: OpexSnd?.valor,
          Planned: sumaPOpex,
          Paid: sumaOpex,
          Accounts: BenefitsRowOpex
        },
      ];
      await redisClient.set(cacheKey, JSON.stringify(FinalAccounts), { EX: 180 });
      res.status(201).json({valido: 1, result: FinalAccounts});
      } catch (error) {
        console.log(error);
      }
  }
  
  function getByBenefitDistributionXLSX(req, res){
    return new Promise(async function (resolve, reject){
        let PlannedAccounts = [];
  
        let capexBenefitPaid = [];
        let opexBenefitPaid = [];
  
        let typeSupplierCt = [];
        let typeBenefitCt = [];

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
  
        const plannedAccounts = await ejecutarStoredProcedure('sp_GetPlannedBenefitbyprojectRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(plannedAccounts){
          PlannedAccounts = plannedAccounts[0];
        }
  
        const capexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFinCapexTypeBenefByRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(capexBenefitpgdo){
          capexBenefitPaid = capexBenefitpgdo[0];
        }
        const opexBenefitpgdo = await ejecutarStoredProcedure('mon_GetFinOpexTypeBenefByRP',[parseInt(req.params.idprojects), req.params.rpnumber]);
        if(opexBenefitpgdo){
          opexBenefitPaid = opexBenefitpgdo[0];
        }
  
        const typeBenefit = await getCatalogs('ct_TypeofBeneficiary');
        if(typeBenefit.length > 0){
          typeBenefitCt = typeBenefit;
        }
  
        const typeSupplier = await getCatalogs('ct_typeofsupplier');
        if(typeSupplier.length > 0){
          typeSupplierCt = typeSupplier;
        }
  
  
      var BenefitsRow = [];
      for(let i=0;i<typeBenefitCt.length;i++){
        let ben = typeBenefitCt[i];
        var supplierRow = [];
        for(let j=0;j<typeSupplierCt.length;j++){
          let supplier = typeSupplierCt[j];
          var Rows = [];
          totalPlanned = 0;
          total = 0;
          if(supplier.Status == ben.IdtypeofBeneficiary){
            for(let x=0;x<capexBenefitPaid.length;x++) {
              let rowCapex = capexBenefitPaid[x]
              if(rowCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){

                let plannedRow;
                plannedRow = PlannedAccounts.find(x => x.LedgerType == "CAPEX" && x.idcapexsubaccount == rowCapex.idcapexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects)
                
                const existingDuplicate = Rows.find(x => x.IdActividaddata === plannedRow?.IdActividaddata && x.idactivitiesprojects === plannedRow.idactivitiesprojects && x.idrpnumber === plannedRow.idrpnumber && x.idcapexsubaccount === plannedRow.idcapexsubaccount)
                if(existingDuplicate){
                  plannedRow = PlannedAccounts.find(x =>  x.LedgerType == "CAPEX" && x.idcapexsubaccount == rowCapex.idcapexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdActividaddata != existingDuplicate.IdActividaddata)
                }
                Rows.push({
                  id: x,
                  Type: rowCapex.Type_of_Supplier,
                  idactivitiesprojects: rowCapex.idactivitiesprojects,
                  idrpnumber: rowCapex.idrpnumber,
                  idcapexsubaccount: rowCapex.idcapexsubaccount,
                  activity: plannedRow ? plannedRow.Actividad : '', // '',
                  IdActividaddata: plannedRow?.IdActividaddata || 0,
                  concept: rowCapex.capexconcepto,
                  planned: plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, // 0,
                  paid: rowCapex.Amount_USD
                })
                totalPlanned +=  plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, //0
                total += rowCapex.Amount_USD
              }
            }
            
            for(let planned=0;planned<PlannedAccounts.length;planned++){
              let plannedCapex = PlannedAccounts[planned];
              if(plannedCapex.LedgerType == "CAPEX"){
                if(plannedCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                  let existingCapexPaid = Rows.find(x => x.IdActividaddata === plannedCapex.IdActividaddata || x.IdActividaddata === plannedCapex.IdActividaddata && x.idcapexsubaccount == plannedCapex.idcapexsubaccount && x.idactivitiesprojects == plannedCapex.idactivitiesprojects && x.idrpnumber == plannedCapex.idrpnumber)
                  if(!existingCapexPaid){
                    Rows.push({
                      id: planned,
                      Type: plannedCapex.Supplier,
                      idrpnumber: plannedCapex.idrpnumber,
                      idcapexsubaccount: plannedCapex.idcapexsubaccount,
                      idactivitiesprojects: plannedCapex.idactivitiesprojects,
                      activity: plannedCapex.Actividad, // '',
                      concept: plannedCapex.CapexConcept,
                      planned: plannedCapex.EstimadoUSD, // 0,
                      paid: 0
                    })
                    totalPlanned += parseFloat(plannedCapex.EstimadoUSD);
                  }
                }
              }
            }

            /** */
            supplierRow.push({
              id:j,
              name: supplier.ShortDescription,
              totalPlanned: totalPlanned,
              totalPaid: total,
              rows: Rows,
            })
          }
        }
  
        let sumaTotalPlanned = 0;
        let sumaTotal = 0;
        for(let sum of supplierRow){
          sumaTotalPlanned += sum.totalPlanned;
          sumaTotal += sum.totalPaid;
        }
        
        BenefitsRow.push({
          id: i,
          name: ben.ShortDescription,
          totalPlanned: sumaTotalPlanned,
          totalPaid: sumaTotal,
          rows: supplierRow,
        });
      }
  
      /** OPEX ARMADO */
      var BenefitsRowOpex = [];
      for(let i=0;i<typeBenefitCt.length;i++){
        let ben = typeBenefitCt[i];
        var supplierRow = [];
        for(let j=0;j<typeSupplierCt.length;j++){
          let supplier = typeSupplierCt[j];
          var Rows = [];
          totalPlanned = 0;
          total = 0;
          if(supplier.Status == ben.IdtypeofBeneficiary){
            for(let x=0;x<opexBenefitPaid.length;x++) {
              let rowCapex = opexBenefitPaid[x]
              if(rowCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                let plannedRow;
                plannedRow = PlannedAccounts.find(x => x.LedgerType == "OPEX" && x.idopexsubaccount == rowCapex.idopexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects)
                
                const existingDuplicate = Rows.find(x => x.IdActividaddata === plannedRow?.IdActividaddata && x.idactivitiesprojects === plannedRow.idactivitiesprojects && x.idrpnumber === plannedRow.idrpnumber && x.idcapexsubaccount === plannedRow.idcapexsubaccount)
                if(existingDuplicate){
                  plannedRow = PlannedAccounts.find(x => x.LedgerType == "OPEX" && x.idopexsubaccount == rowCapex.idopexsubaccount && x.idrpnumber == rowCapex.idrpnumber && x.idactivitiesprojects == rowCapex.idactivitiesprojects && x.IdActividaddata != existingDuplicate.IdActividaddata)
                }

                Rows.push({
                  id: x,
                  Type: rowCapex.Type_of_Supplier,
                  idactivitiesprojects: rowCapex.idactivitiesprojects,
                  idopexsubaccount: rowCapex.idopexsubaccount,
                  idrpnumber: rowCapex.idrpnumber,
                  IdActividaddata: plannedRow?.IdActividaddata || 0,
                  activity: plannedRow ? plannedRow.Actividad : '', //'',
                  concept: rowCapex.Opexconcepto,
                  planned: plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0, //0,
                  paid: rowCapex.Amount_USD
                })
                totalPlanned += plannedRow ? parseFloat(plannedRow.EstimadoUSD) : 0 //0
                total += rowCapex.Amount_USD
              }
            }

            for(let planned=0;planned<PlannedAccounts.length;planned++){
              let plannedCapex = PlannedAccounts[planned];
              if(plannedCapex.LedgerType == "OPEX"){
                if(plannedCapex.IdtypeofSupplier == supplier.IdtypeofSupplier){
                  let existingCapexPaid = Rows.find(x => x.IdActividaddata === plannedCapex.IdActividaddata || x.IdActividaddata === plannedCapex.IdActividaddata && x.idopexsubaccount == plannedCapex.idopexsubaccount && x.idactivitiesprojects == plannedCapex.idactivitiesprojects && x.idrpnumber == plannedCapex.idrpnumber)
                  if(!existingCapexPaid){
                    Rows.push({
                      id: planned,
                      Type: plannedCapex.Supplier,
                      idrpnumber: plannedCapex.idrpnumber,
                      idopexsubaccount: plannedCapex.idopexsubaccount,
                      idactivitiesprojects: plannedCapex.idactivitiesprojects,
                      activity: plannedCapex.Actividad, // '',
                      concept: plannedCapex.CapexConcept,
                      planned: plannedCapex.EstimadoUSD, // 0,
                      paid: 0
                    })
                    totalPlanned += parseFloat(plannedCapex.EstimadoUSD);
                  }
                }
              }
            }
            supplierRow.push({
              id:j,
              name: supplier.ShortDescription,
              totalPlanned: totalPlanned,
              totalPaid: total,
              rows: Rows,
            })
          }
        }
  
        let sumaTotal = 0;
        let sumaTotalP = 0;
        for(let sum of supplierRow){
          sumaTotalP += sum.totalPlanned;
          sumaTotal += sum.totalPaid;
        }
        
        BenefitsRowOpex.push({
          id:i,
          name: ben.ShortDescription,
          totalPlanned: sumaTotalP,
          totalPaid: sumaTotal,
          rows: supplierRow,
        });
      }
  
      let sumaCapex = 0;
      let sumaPCapex = 0;
      let sumaOpex = 0;
      let sumaPOpex = 0;
  
      for(let sum of BenefitsRow){
        sumaPCapex += sum.totalPlanned;
        sumaCapex += sum.totalPaid;
      }
  
      for(let sum of BenefitsRowOpex){
        sumaPOpex += sum.totalPlanned
        sumaOpex += sum.totalPaid;
      }
  
      let FinalAccounts = [
        {
          id: 1,
          Name: 'Capex Accounts',
          Approved: CapexSnd?.total,
          Planned: sumaPCapex,
          Paid: sumaCapex,
          Accounts: BenefitsRow
        },
        {
          id: 2,
          Name: 'Opex Accounts',
          Approved: OpexSnd?.valor,
          Planned: sumaPOpex,
          Paid: sumaOpex,
          Accounts: BenefitsRowOpex
        },
      ];
      
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Financial Tracker', {
      properties: { tabColor: { argb: 'FF0000' } }
    });
  
    sheet.columns = [
      { header: 'Accounts', key: 'Name', width: 20 },
      { header: 'By beneficiary', key: 'name', width: 35 },,
      { header: 'Type', key: 'Type', width: 35 },
      { header: 'Account', key: 'concept', width: 60 },
      { header: 'Approved', key: 'approved', width: 18, style: { numFmt: '"$"#,##0.00' } },
      { header: 'Planned', key: 'planned', width: 18, style: { numFmt: '"$"#,##0.00' } },
      { header: 'Paid', key: 'paid', width: 18, style: { numFmt: '"$"#,##0.00' } },
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
  
    FinalAccounts.forEach(item => {
      const newRow = sheet.addRow({
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
            const newRow = sheet.addRow({
              name: sub.name,
              planned: sub.totalPlanned,
              paid: sub.totalPaid,
          });

          newRow.getCell('name').font = { bold: true };
          newRow.getCell('planned').font = { bold: true };
          newRow.getCell('paid').font = { bold: true };

          if (sub.rows && sub.rows.length > 0) {
              sub.rows.forEach(row => {
                const newRow = sheet.addRow({
                      name: row.name,
                      planned: row.totalPlanned,
                      paid: row.totalPaid,
                  });

                  if (row.rows && row.rows.length > 0) {
                      row.rows.forEach(subrow => {                      
                        const newRow = sheet.addRow({
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
  
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);
  
    await workbook.xlsx.write(res);
    res.end();
  
    })
  }

module.exports = {
    getByBenefitDistribution,
    getByBenefitDistributionXLSX,
}