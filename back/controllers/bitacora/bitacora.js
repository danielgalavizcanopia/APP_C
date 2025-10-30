const { ejecutarStoredProcedure, ejecutarStoredProcedurev2 } = require('../../queries/projects')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { Header, Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, ShadingType, TextRun, BorderStyle, AlignmentType } = require("docx");

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

async function viewPDFFiles(req, res){
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '../media/bitacora', fileName);

        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).send('Imagen no encontrada');
            }
        });
    } catch (error) {
        
    }
}

async function getBitacoraByProject(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetBitacoraByProject', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}


async function setBitacora(req, res) {
    let IDUser = await catchUserLogged(req);

    const filePath = req.file ? path.posix.join('media/bitacora', path.basename(req.file.path)) : null;
    const body = req.body;
    const relEvidences = JSON.stringify(body.rel_evidences_Json || '[]')
    const evidences = JSON.stringify(body.evidences_Json || [])
    try {
        const resultados = await ejecutarStoredProcedurev2('sp_PLog_upsert_full',[
            body.idbitacora,
            body.idprojects,
            body.fecha_evento,
            body.Descripcion_evento,
            body.agreements,
            body.DecisionsRequired,
            IDUser.IDUser,
            body.IDHitoProceso,
            body.blogTitle,

            relEvidences,
            evidences,
        ]);
        if(resultados.length > 0){
            res.status(200).json({valido: 1, result: resultados[0][0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getBitacoraById(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetBitacoraById', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}



async function getEvidenciasByBitacora(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetEvidenciasByBitacora', [req.params.id]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function updateEvidencia(req, res) {
    let IDUser = await catchUserLogged(req);
    const body = JSON.parse(req.body.body)
    let filePath
    var evidencias
    var evidencia
    const resultados = await ejecutarStoredProcedure('sp_GetEvidenciasByBitacora', [body.idbitacora]);
    if (resultados.length > 0) {
        evidencias = resultados[0];
        evidencia = evidencias.find(x=>x.idevidencia == body.idevidencia);
    }
    if(!req.file){
        if(evidencia && evidencia.datos_adjuntos) filePath = evidencia.datos_adjuntos
    } else {
        filePath = req.file ? path.posix.join('media/bitacora', path.basename(req.file.path)) : null;
        if(evidencia && evidencia.datos_adjuntos) await deleteDocument(path.posix.join(evidencia.datos_adjuntos));
    }

    try {
        const resultados = await ejecutarStoredProcedure('sp_UpdateEvidencia', [
            body.idevidencia,
            body.idbitacorarelevidencia,
            body.link_evidencia,
            filePath,
            IDUser.IDUser,
            body.IDUserModify,
            // body.IDUserValidate,
            body.idareas,
            body.Observaciones,
            body.idbitacora,
            body.IDCategoriaEvidencia,
            body.IDTipoEvidencia,
            body.IDHitoProceso
            ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function setValidateEvidence(req, res) {
    let IDUser = await catchUserLogged(req);

    try {
        let conditionalID = req.body.conditional;
        const resultados = await ejecutarStoredProcedure('sp_UPDATEValidateEvidence', [
            req.body.idevidencia,
            conditionalID  ? IDUser.IDUser : null,
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

function getLinkEvidenciasByBitacora(req, res){
    return new Promise(async function(resolve, reject){
        let bitacoras = [];
        let bitacoraFinal = []

        let resBitacoras = await ejecutarStoredProcedure('sp_GetBitacoraFiltered', [
            req.body.fechaInicio ? req.body.fechaInicio : null,
            req.body.fechaFin ? req.body.fechaFin : null,
            req.body.IDHitoProceso ? req.body.IDHitoProceso : null,
            req.body.blogTitle ? req.body.blogTitle : null,
            req.body.Foliobitacora ? req.body.Foliobitacora : null,
            req.body.IDUser ? req.body.IDUser : null,
            req.body.idprojects
        ]);
        if (resBitacoras.length > 0) {
            bitacoras = resBitacoras[0];
            for(let bitacora of bitacoras){
                const resEvidencias = await ejecutarStoredProcedure('sp_GetEvidenciasByBitacora', [bitacora.idbitacora]);
                if (resEvidencias.length > 0) {
                    bitacoraFinal.push({
                        blogTitle: bitacora.blogTitle,
                        Foliobitacora: bitacora.Foliobitacora,
                        Milestone: bitacora.Milestone,
                        fecha_evento: bitacora.fecha_evento,
                        Descripcion_evento: bitacora.Descripcion_evento,
                        DecisionsRequired: bitacora.DecisionsRequired,
                        agreements: bitacora.agreements,
                        idbitacora: bitacora.idbitacora,
                        evidencias: resEvidencias[0]
                    });
                }
            }
            res.status(200).json({valido: 1, result: bitacoraFinal});
        } else {
            res.status(404).json({valido: 0, message: "No data found for the given project ID" });
        }
        
    })
}

async function getBitacoraFiltered(req, res) {
    try {
        const resultados = await ejecutarStoredProcedure('sp_GetBitacoraFiltered', [
            req.body.fechaInicio,
            req.body.fechaFin,
            req.body.IDHitoProceso,
            req.body.IDUser,
            req.body.idprojects
        ]);
        if (resultados.length > 0) {
            res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getBitacoraWithEvidences(req, res){
    try {
        let bitacoras = [];
        let bitacoraFinal = []
        let params = req.query;

        let resBitacoras = await ejecutarStoredProcedure('sp_GetBitacoraFiltered', [
            params.fechaInicio != 'null' ? params.fechaInicio : null,
            params.fechaFin != 'null' ? params.fechaFin : null,
            params.IDHitoProceso != 'undefined' ? params.IDHitoProceso : null,
            params.blogTitle != 'undefined' ? params.blogTitle : null,
            params.Foliobitacora != 'undefined' ? params.Foliobitacora : null,
            params.IDUser == 'undefined' || params.IDUser == 'null' ? null : params.IDUser,
            parseInt(params.idprojects)
        ]);
        if (resBitacoras.length > 0) {
            bitacoras = resBitacoras[0];
            for(let bitacora of bitacoras){
                const resEvidencias = await ejecutarStoredProcedure('sp_GetEvidenciasByBitacora', [bitacora.idbitacora]);
                if (resEvidencias.length > 0) {
                    bitacoraFinal.push({
                        Milestone: bitacora.Milestone,
                        fecha_evento: bitacora.fecha_evento,
                        Descripcion_evento: bitacora.Descripcion_evento,
                        DecisionsRequired: bitacora.DecisionsRequired,
                        agreements: bitacora.agreements,
                        idbitacora: bitacora.idbitacora,
                        evidencias: resEvidencias[0]
                    });
                }
            }

            if(bitacoraFinal.length > 0){
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Project Logs', {
                    properties: { tabColor: { argb: 'FF0000' } }
                });

                sheet.columns = [
                    { header: 'Milestone', key: 'Milestone', width: 22 },
                    { header: 'Event Date', key: 'fecha_evento', width: 22 },
                    { header: 'Description', key: 'Descripcion_evento', width: 75 },
                    { header: 'Decisions Required', key: 'DecisionsRequired', width: 75 },
                    { header: 'Agreements', key: 'agreements', width: 75 },
                    { header: 'Evidencias (Tipo)', key: 'link_evidencia', width: 50 },
                    { header: 'Evidencias (Descripción)', key: 'Observaciones', width: 75 },
                ];

                function printEvidencias(sheet, evidencias, startRow) {
                    let currentRow = startRow;

                    evidencias.forEach((evidencia) => {
                    sheet.getRow(currentRow).getCell(6).value = evidencia.link_evidencia;
                    sheet.getRow(currentRow).getCell(7).value = evidencia.Observaciones;
                    currentRow++;
                    });

                    return currentRow;
                }

                let currentRow = 2;
                bitacoraFinal.forEach((item) => {
                    sheet.addRow({
                    Milestone: item.Milestone,
                    fecha_evento: item.fecha_evento,
                    Descripcion_evento: item.Descripcion_evento,
                    DecisionsRequired: item.DecisionsRequired,
                    agreements: item.agreements,
                    });

                    if (item.evidencias && item.evidencias.length > 0) {
                    currentRow = printEvidencias(sheet, item.evidencias, currentRow + 1);
                    } else {
                    currentRow++;
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
                  
                  sheet.getRow(1).height = 25;
                  
                  sheet.eachRow(row => {
                    row.eachCell(cell => {
                      cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                      };
                    });
                  });

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=ProjectLog.xlsx`);

                await workbook.xlsx.write(res);
                res.end();
                
            }
        } else {
            res.status(404).json({valido: 0, message: "No data found for the given project ID" });
        }
    } catch (error) {
        
    }
}
async function getBitacoraXLSX(req, res) {
    try {

        let params = req.query;

        const resultados = await ejecutarStoredProcedure('sp_GetBitacoraFiltered', [
            params.fechaInicio != 'null' ? params.fechaInicio : null,
            params.fechaFin != 'null' ? params.fechaFin : null,
            params.IDHitoProceso != 'undefined' ? params.IDHitoProceso : null,
            params.blogTitle != 'undefined' ? params.blogTitle : null,
            params.Foliobitacora != 'undefined' ? params.Foliobitacora : null,
            params.IDUser == 'undefined' || params.IDUser == 'null' ? null : params.IDUser,
            parseInt(params.idprojects)
        ]);
        if (resultados.length > 0) {

            let bitacoras = resultados[0];
            if(bitacoras.length != 0){
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Project Logs', {
                    properties: { tabColor: { argb: 'FF0000' } }
                });

                sheet.columns = [
                    { header: 'Milestone', key: 'Milestone', width: 22 },
                    { header: 'Event Date', key: 'fecha_evento', width: 22 },
                    { header: 'Description', key: 'Descripcion_evento', width: 75 },
                    { header: 'Decisions Required', key: 'DecisionsRequired', width: 75 },
                    { header: 'Agreements', key: 'agreements', width: 75 },
                ];

                bitacoras.forEach(item => {
                    sheet.addRow({
                      Milestone: item.Milestone,
                      fecha_evento: item.fecha_evento,
                      Descripcion_evento: item.Descripcion_evento,
                      DecisionsRequired: item.DecisionsRequired,
                      agreements: item.agreements,
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
                  
                  sheet.getRow(1).height = 25;
                  
                  sheet.eachRow(row => {
                    row.eachCell(cell => {
                      cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                      };
                    });
                  });

                  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                  res.setHeader('Content-Disposition', `attachment; filename=ProjectLog.xlsx`);

                  await workbook.xlsx.write(res);
                  res.end();
                
            }
            // res.status(200).json({valido: 1, result: resultados[0]});
        } else {
            res.status(404).json({ message: "No data found for the given project ID." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

async function getBitacoraDOCX(req, res) {
    try {
        let params = req.query;

        const resultados = await ejecutarStoredProcedure('sp_GetBitacoraFiltered', [
            params.fechaInicio != 'null' ? params.fechaInicio : null,
            params.fechaFin != 'null' ? params.fechaFin : null,
            params.IDHitoProceso != 'undefined' ? params.IDHitoProceso : null,
            params.blogTitle != 'undefined' ? params.blogTitle : null,
            params.Foliobitacora != 'undefined' ? params.Foliobitacora : null,
            params.IDUser == 'undefined' || params.IDUser == 'null' ? null : params.IDUser,
            parseInt(params.idprojects)
        ]);
        if (resultados.length > 0){
            let bitacoras = resultados[0];
            if(bitacoras.length != 0){

                let ProjectName = bitacoras[0].ProjectName;

                const createTab = (item) => {
                    const table = new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [

                                                    new TextRun({
                                                        text: "Hito",
                                                        bold: true,
                                                        size: 36,
                                                    }),
                                                ]
                                            }),
                                            new Paragraph(item.Milestone),
                                        ],
                                    }),

                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [

                                                    new TextRun({
                                                        text: "Descripción",
                                                        bold: true,
                                                        size: 36,
                                                    }),
                                                ]
                                            }),
                                            new Paragraph(item.Descripcion_evento),
                                        ],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [

                                                    new TextRun({
                                                        text: "Decisiones",
                                                        bold: true,
                                                        size: 36,
                                                    }),
                                                ]
                                            }),
                                            new Paragraph(item.DecisionsRequired),
                                        ],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [

                                                    new TextRun({
                                                        text: "Acuerdos",
                                                        bold: true,
                                                        size: 36,
                                                    }),
                                                ]
                                            }),
                                            new Paragraph(item.agreements),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                        borders: {
                            top: {
                                size: 1,
                                color: "FFFFFF",
                            },
                            bottom: {
                                size: 5,
                                color: "FFFFFF",
                            },
                            left: {
                                size: 5,
                                color: "FFFFFF",
                            },
                            right: {
                                size: 5,
                                color: "FFFFFF",
                            },
                        },
                    });

                    return table;
                }
    
                const bitacorasTable = bitacoras.map((bitacora) => createTab(bitacora));
    
    
                const doc = new Document({
                    styles: {
                        paragraphStyles: [
                            {
                                id: "Normal",
                                name: "Normal",
                                basedOn: "Normal",
                                next: "Normal",
                                quickFormat: true,
                                run: {
                                    font: "Red Hat Display",
                                    size: 24,
                                },
                                paragraph: {
                                    spacing: { line: 276 },
                                    alignment: AlignmentType.JUSTIFIED
                                },
                            },
                        ],
                    },
    
                    /** SECTIONS */
                    headers: {
                        default: new Header({
                            children: [new Paragraph("Header text")],
                        }),
                    },
                    sections:[
                        {
                            headers: {
                                default: new Header({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: "Reporte de evidencias de proyecto: " + ProjectName,
                                                    break:1
                                                }),
                                            ],
                                        }),
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: "Fecha " + new Date().toISOString().split('T')[0],
                                                    break:1
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: ProjectName,
                                            bold: true,
                                            size: 32,
                                            break:1,
                                        }),
                                        new TextRun({
                                            text: "Reporte de Evidencias",
                                            bold: true,
                                            size: 32,
                                            break:1,
                                        }),
                                    ],
                                    alignment: "center",
                                    spacing: { after: 400 }, // Espacio después del título
                                }),
                                ...bitacorasTable.flatMap((tabla, index) => [
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: `Bitacora ${index + 1}`,
                                            size:28
                                        })],
                                        spacing: { after: 200 },
                                    }),
                                    tabla,
                                    new Paragraph(" "),
                                ]),
                            ],
                        }
                    ]
                })
                const buffer = await Packer.toBuffer(doc);
    
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                res.setHeader('Content-Disposition', `attachment; filename=ProjectLog.docx`);
                res.send(buffer);
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }

        }
    } catch (error) {
        console.log(error);
    }
}

/** FUNCIÓN NODE EXTRA */
function deleteDocument(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
  }
/** FIN FUNCIÓN NODE EXTRA */

module.exports = {
    getBitacoraByProject,
    getBitacoraById,
    setBitacora,
    viewPDFFiles,
    getEvidenciasByBitacora,
    updateEvidencia,
    setValidateEvidence,
    getLinkEvidenciasByBitacora,
    getBitacoraFiltered,
    getBitacoraXLSX,
    getBitacoraDOCX,
    getBitacoraWithEvidences,
}