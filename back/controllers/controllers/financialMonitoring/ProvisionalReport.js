const { getSharepointRegisters } = require('./Sharepoint');
const { ejecutarStoredProcedure } = require('../../queries/projects'); 
const { ejecutarVistaTools } = require('../../queries/executeViews')

const ExcelJS = require('exceljs');

async function getProvisionalXlsx(req, res){
    try {

        let capexActual = [];
        let opexActual = [];
        let lastDate;

        const capex = await ejecutarStoredProcedure('sp_GetCuentsActivitiesbyprojectandRP', [parseInt(req.params.idProject), req.params.rpnumbers]);
        if(capex.length > 0){
            capexActual = capex[0];
        } 
        const opex = await ejecutarStoredProcedure('sp_GetOpexWithActivities', [parseInt(req.params.idProject), req.params.rpnumbers]);
        if(opex.length > 0){
            opexActual = opex[0];
        }

        const getLastDate = await ejecutarVistaTools('vw_dateprovisional'); /** OBTENEMOS LA ULTIMA FECHA DEL LEDGER CARGADO */
        if(getLastDate.length > 0){
          lastDate = getLastDate[0];
        }

        const FolioProject = req.params.folioProject
        let SharepointInitialRows
        if(FolioProject){
          SharepointInitialRows = await getSharepointRegisters(FolioProject);
        } else {
          SharepointInitialRows = [];
        }

        const diaLedged = lastDate.Created; /** ASIGNAMOS LA FECHA DEL ULTIMO LEDGER CARGADO EN BD */
        const diaDespues = new Date(diaLedged);
        diaDespues.setDate(diaLedged.getDate() + parseInt(process.env.DAYS_TIME)); /** SE LE SUMA UN DÍA, PARA LLENAR EL VACÍO EN LO QUE SE CARGA LA NUEVA DATA */
        const fechaActual = new Date(); /* SE OBTIENE LA FECHA DEL DÍA DE HOY PARA HACER UN CORTE */
        const titulosPermitidos = ["Pago Directo a Proveedor", "Reembolso", "Comprobación"]; /** LOS TIPOS DE TITULO QUE DEBEN DE TENER LOS REGISTROS DENTRO DE SHAREPOINT */
        /** SE HACE UN FILTRADO DE TODO EL RESULTADO, PARA TRAER LOS QUE ENTRAN EN LAS FECHAS DECLARADAS */
        const SharepointFinalRows = SharepointInitialRows.filter(registro => {
          return registro.fields.Created >= diaDespues.toISOString() && registro.fields.Created <= fechaActual.toISOString() && titulosPermitidos.includes(registro.fields.Title);
        });


        let FinalArray = [];
        for(let capex of capexActual){
            if(capex.idcapexsubaccount){
                const sharepointRows = SharepointFinalRows.filter(row => parseInt(row.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(capex.cuentacompaq) && parseInt(row.fields?.RP.slice(2)) == capex.idrpnumber && capex.idactivitiesprojects == row.fields?.IDAct);
                if(sharepointRows.length > 0){
                    for(let sharepointRow of sharepointRows){
                        const date = sharepointRow.fields.Created.split('T')[0];
                        const monto = parseFloat(sharepointRow.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(sharepointRow.fields?.ImporteProrrateoFactura) : parseFloat(sharepointRow.fields?.Total_x0028_DetalleMontoFactura_)
                        FinalArray.push({
                            ledger: "Capex",
                            Mes: sharepointRow.fields.Mes,
                            ProjectName: sharepointRow.fields.ProjectName,
                            CtaEjidoCapex: sharepointRow.fields.Cta_x0028_Ejido_x003a_CAPEX_x0020,
                            ConceptoEjidoCapex: sharepointRow.fields.Concepto_x0028_Ejido_x003a_CAPEX,
                            Detalledegasto: sharepointRow.fields.Detalledegastos,
                            Monto: monto,
                            Created: date
                        });
                    }
                }
            }
        }

        for(let opex of opexActual){
            if(opex.idopexsubaccount){
                const sharepointRows = SharepointFinalRows.filter(row => parseInt(row.fields?.Cta_x002e_Contpaq_x0028_Ejido_x0) == parseInt(opex.cuentacompaq) && parseInt(row.fields?.RP.slice(2)) == opex.idrpnumber && row.fields?.IDAct == opex.idactivitiesprojects);
                if(sharepointRows.length > 0){
                    for(let sharepointRow of sharepointRows){
                        const date = sharepointRow.fields.Created.split('T')[0];
                        const monto = parseFloat(sharepointRow.fields?.ImporteProrrateoFactura) != 0 ? parseFloat(sharepointRow.fields?.ImporteProrrateoFactura) : parseFloat(sharepointRow.fields?.Total_x0028_DetalleMontoFactura_)
                        FinalArray.push({
                            ledger: "Opex",
                            Mes: sharepointRow.fields.Mes,
                            ProjectName: sharepointRow.fields.ProjectName,
                            CtaEjidoCapex: sharepointRow.fields.Cta_x0028_Ejido_x003a_CAPEX_x0020,
                            ConceptoEjidoCapex: sharepointRow.fields.Concepto_x0028_Ejido_x003a_CAPEX,
                            Detalledegasto: sharepointRow.fields.Detalledegastos,
                            Monto: monto,
                            Created: date
                        });
                    }
                }
            }   
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Provisional Details Report', {
            properties: { tabColor: { argb: 'FF0000' } }
        });

            sheet.columns = [
            { header: 'Ledger', key: 'ledger', width: 12 },
            { header: 'Month', key: 'Mes', width: 20 },
            { header: 'Project Name', key: 'ProjectName', width: 20 },
            { header: 'Account', key: 'CtaEjidoCapex', width: 15 },
            { header: 'Concept', key: 'ConceptoEjidoCapex', width: 47 },
            { header: 'Details', key: 'Detalledegasto', width: 67 },
            { header: 'Amount (MXN)', key: 'Monto', width: 20, style: { numFmt: '"$"#,##0.00' } },
            { header: 'Created', key: 'Created', width: 15 },
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

        FinalArray.forEach(row => {
            const newRow = sheet.addRow({
                Mes: row.Mes,
                ProjectName: row.ProjectName,
                CtaEjidoCapex: row.CtaEjidoCapex,
                ledger: row.ledger,
                ConceptoEjidoCapex: row.ConceptoEjidoCapex,
                Detalledegasto: row.Detalledegasto,
                Monto: row.Monto,
                Created: row.Created
            });
        })

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=TESTRP.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error);
        
    }

}

module.exports = {
    getProvisionalXlsx
}