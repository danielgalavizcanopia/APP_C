const { ejecutarStoredProcedure } = require('../../queries/projects');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { Header, Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, ShadingType, TextRun, AlignmentType, ImageRun, PageOrientation } = require("docx");
const { presentacion, presentacion2, presentacion3, presentacion4, presentacion5, objetivos1, objetivos2, objetivos3, objetivos4, objetivos5, objetivos6, lineatiempo,
        actividades1, actividades2
    } = require('../../utils/jsons/docxJson.json');

/** PARA EJECUTAR ESTA FUNCIÓN, MEDIANTE UNA RUTA, MANDAREMOS EL ID DEL PLAN ANUAL, Y SE HARÁ TODO EN CADENA */
function generateDocxAnnualPlan(req, res){
    return new Promise(async function(resolve, reject){
        let AnnualPlan;
        let Dates;
        let Activities = [];
        let tablas = [];

        /** PRIMERO SACAMOS EL PLAN ANUAL EN CUESTIÓN */
        const AplanById = await ejecutarStoredProcedure('sp_GetPlanAnualByIdplananual',[req.params.id]);
        if(AplanById){
            AnnualPlan = AplanById[0][0];

            const ActivitiesByPlan = await ejecutarStoredProcedure('sp_getActividadesByPlanAnual',[req.params.id]);
            if(ActivitiesByPlan){
                Activities = ActivitiesByPlan[0].sort((a, b) => new Date(a.actividaddatestart).getTime() - new Date(b.actividaddatestart).getTime());

                var options = { year: 'numeric', month: 'long', day: 'numeric' }

                

                const datesRP = await ejecutarStoredProcedure('sp_getDatesPlanAnualByProject_RP',[AnnualPlan.idprojects, AnnualPlan.idrpnumber]);
                if(datesRP){
                    Dates = datesRP[0][0];
                }


                let fechaInicioActividades = Dates.Reporting_period_start.toLocaleDateString("es-ES", options)
                let fechaFinalActividades = Dates.Reporting_period_end.toLocaleDateString("es-ES", options)
                /** 1RA TABLA DE INICIO DE ACTIVIDADES */
                tablas.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph("N°")],
                                shading: {
                                    type: ShadingType.CLEAR,
                                    color: "FFFFFF", 
                                    fill: "000000",
                                },
                            }),
                            new TableCell({
                                children: [new Paragraph("ACTIVIDAD")],
                                width: {
                                    size: 3505,
                                    type: WidthType.DXA,
                                },
                                shading: {
                                    type: ShadingType.CLEAR,
                                    color: "FFFFFF", 
                                    fill: "000000",
                                },
                            }),
                            new TableCell({
                                children: [new Paragraph("DESCRIPCIÓN")],
                                width: {
                                    size: 5505,
                                    type: WidthType.DXA,
                                },
                                shading: {
                                    type: ShadingType.CLEAR,
                                    color: "FFFFFF", 
                                    fill: "000000",
                                },
                            }),
                        ],
                        tableHeader: true,
                    })
                )

                /** EL CICLO FOR IRÁ ANIDADO CON LAS 2DAS TABLAS, PARA SACAR EL REPORTEO */
                for(let i = 0; i< Activities.length; i++){
                    let activity = Activities[i];
                    tablas.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${i + 1}`,
                                                    color: "FF0000"
                                                })
                                            ],
                                        })
                                    ],
                                    
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: activity.Actividad || activity.NombreActividad,
                                                    color: "FF0000"
                                                })
                                            ],
                                        }
                                    )],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: activity.objetivo,
                                                    color: "FF0000"
                                                })
                                            ],
                                        }
                                    )],
                                }),
                            ],
                        })
                    )
                }

                const createTable = (item) => {             
                    
                    const cuantitativosList = item.Cuantitativos ? item.Cuantitativos.split('||') : [];
                    const paragraphs = cuantitativosList.map(text => 
                        new Paragraph({
                            children: [
                                new TextRun(text)
                            ],
                            bullet: {
                                level: 0,
                            }
                        })
                    );
                    let reporting = item.ReportingData ? item.ReportingData.split('\n') : '';
                    const parrafoLista = reporting.length > 0 ? reporting.map((item) => new Paragraph({
                        children: [
                            new TextRun(item && item.includes("---") ? '' : item)
                        ],
                    })) : [new Paragraph("Sin registro")];

                    const reportingTable = new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({alignment: AlignmentType.CENTER, text: "ROLES"})],
                                        columnSpan: 5,
                                        shading: {
                                            type: ShadingType.CLEAR,
                                            color: "FFFFFF", 
                                            fill: "088F83",
                                        },
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph("Ejecutor de campo")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Coordinador")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Seguimiento")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Supervisor")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Evaluador")],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(item.UserEjecutordeCampo ? item.UserEjecutordeCampo : 'Sin Registro')],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(item.IDUserCoordinador ? item.IDUserCoordinador : 'Sin Registro')],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(item.IDUserSeguimiento ? item.IDUserSeguimiento : 'Sin Registro')],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(item.UserSupervisor ? item.UserSupervisor : 'Sin Registro')],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(item.IDUserEvaluador ? item.IDUserEvaluador : 'Sin Registro')],
                                    }),
                                ],
                            }),
                            
                        ],

                        width: { size: 10000, type: WidthType.DXA },
                    });

                    const rows = [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Actividad")],
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph(item.Actividad || item.NombreActividad)],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Objetivo")],
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph(item.objetivo)],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Metodología")],
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph(item.SOPdescription)],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Periodo de ejecución")],
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph(item.actividaddatestart.toLocaleString().split(', ')[0] + " - " + item.actividaddateend.toLocaleString().split(', ')[0])],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Presupuesto (USD)")],
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph("$ " + numberWithCommas(item.EstimadoUSD))],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph("Indicadores")],
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                    width: {
                                        size: 1505,
                                        type: WidthType.DXA,
                                    },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph(item.Cualitativos ? "Cualitativos: " + item.Cualitativos : ''),
                                        new Paragraph("Cuantitativos:"),
                                        ...paragraphs
                                    ],
                                    width: {
                                        size: 5505,
                                        type: WidthType.DXA,
                                    },
                                }),
                            ],
                        }),
                        new TableRow({
                            children:[
                                new TableCell({
                                    children: [new Paragraph({alignment: AlignmentType.CENTER, text: "REPORTEO"})],
                                    columnSpan: 2,
                                    width: { size: 10000, type: WidthType.DXA },
                                    shading: {
                                        type: ShadingType.CLEAR,
                                        color: "FFFFFF", 
                                        fill: "088F83",
                                    },
                                }),
                            ]
                        }),
                        new TableRow({
                            children:[
                                new TableCell({
                                    // children: [rpTable],
                                    children: parrafoLista,
                                    columnSpan: 2,
                                    width: { size: 10000, type: WidthType.DXA },
                                }),
                            ]
                        }),
                        new TableRow({
                            children:[
                                new TableCell({
                                    children: [reportingTable],
                                    columnSpan: 2,
                                    width: { size: 10000, type: WidthType.DXA },
                                }),
                            ]
                        }),
                        new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    text: [ new TextRun(item.linkdelarchivo ? "Ubicación geográfica" : '')],
                                    alignment: AlignmentType.CENTER, 
                                    children: item.linkdelarchivo ? [
                                      new ImageRun({
                                        data: fs.readFileSync(item.linkdelarchivo),
                                        transformation: {
                                          width: 300,
                                          height: 300,
                                        },
                                        
                                      }),
                                    ] : [new Paragraph("Sin imagen previa")]
                                  }),
                                ],
                                columnSpan: 2,
                              }),
                            ],
                          })
                    ];


                
                    return new Table({
                        rows: [...rows],
                        width: { size: 10000, type: WidthType.DXA },
                    });
                };

                const fichaActividades = Activities.map((actividad) => createTable(actividad));

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
                                },
                            },
                        ],
                    },
                    
                    sections: [
                        {
                            headers: {
                                default: new Header({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: "Periodo de Reporte " + AnnualPlan.idrpnumber,
                                                    bold: true,
                                                    size: 24,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                      new TextRun({
                                        text: "Plan Anual de Implementación",
                                        bold: true,
                                        size: 40,
                                      }),
                                      new TextRun({
                                        text: AnnualPlan.ProjectName,
                                        bold: true,
                                        size: 36,
                                        break:1
                                      }),
                                      new TextRun("\n"),
                                    ]
                                }),

                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: "Presentación",
                                            size: 28,
                                            break: 1
                                        }),
                                        new TextRun({
                                            text: presentacion + AnnualPlan.ProjectName,
                                            size: 24,
                                            break: 2
                                        }),
                                        new TextRun("\n"),
                                        new TextRun({
                                            text: presentacion2 + AnnualPlan.ProjectName + presentacion3 + "RP" + AnnualPlan.idrpnumber + "(" + AnnualPlan.DateCreate.toISOString().split('T')[0] + ")," + presentacion4 + AnnualPlan.ProjectName + presentacion5,
                                            size: 24,
                                            break: 2
                                        }),
                                        new TextRun("\n"),
                                        
                                    ]
                                }),
                                new Paragraph ({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: "Objetivos",
                                            size: 28,
                                            break:2
                                        })
                                    ]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: objetivos1 + AnnualPlan.ProjectName + objetivos2,
                                            size: 24,
                                        }),
                                    ],
                                    bullet: {
                                        level: 0,
                                    },
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: objetivos3 + AnnualPlan.ProjectName + objetivos4,
                                            size: 24,
                                        }),
                                    ],
                                    bullet: {
                                        level: 0,
                                    },
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: objetivos5,
                                            size: 24,
                                        }),
                                    ],
                                    bullet: {
                                        level: 0,
                                    },
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: objetivos6,
                                            size: 24,
                                        }),
                                    ],
                                    bullet: {
                                        level: 0,
                                    },
                                }),
                            ]
                        },
                        {
                            children: [
                                new Paragraph ({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: "Línea de tiempo Período de Reporte actual número " + AnnualPlan.idrpnumber,
                                            size: 28,
                                        })
                                    ]
                                }),
                                new Paragraph ({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: lineatiempo,
                                            size: 24,
                                            break:1
                                        }),
                                    ]
                                }),
                                new Paragraph ({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: "Crear e integrar la Línea de Tiempo Correspondiente para el RP",
                                            size: 24,
                                            break:3,
                                            color: "FF0000"
                                        })
                                    ]
                                }),
                                new Paragraph ({
                                    children: [
                                        new TextRun({
                                            text: "Actividades del periodo de reporte "+ AnnualPlan.idrpnumber,
                                            size: 28,
                                            break:1
                                        }),
                                    ]
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.JUSTIFIED,
                                    children: [
                                        new TextRun({
                                            text: actividades1 + AnnualPlan.ProjectName  + ' del ' + fechaInicioActividades + ' al ' + fechaFinalActividades + actividades2,
                                            size: 24,
                                            break:2
                                        }),
                                    ]
                                })
                            ]
                        },
                        {
                            children: [
                                 // Primer párrafo (con texto)
                                new Paragraph({
                                    children: [
                                    new TextRun({
                                        text: "Actividades que contribuyen al incremento de los acervos de carbono forestal",
                                        size: 28, // Tamaño de la fuente
                                    }),
                                    ],
                                }),
                        
                                // Segundo párrafo (con imagen centrada)
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new ImageRun({
                                          type: 'jpg',
                                          data: fs.readFileSync("./utils/images/Diagrama_ActImplementacion_Plantilla.jpg"), // Cargar imagen desde la ruta
                                          transformation: { width: 600, height: 450 }, // Ajuste de tamaño de la imagen
                                        }),
                                    ],
                                }),
                            ]
                        },
                        {
                            children: [
                                new Paragraph("Actividades del periodo de reporte " + AnnualPlan.idrpnumber),
                                new Table({
                                    rows: tablas
                                }),
                                new Paragraph(''),
                            ]
                        },
                        {
                            children: [
                                new Paragraph ({
                                    children: [
                                        new TextRun({
                                            text: "Cronograma de actividades de implementación del Período de Reporte",
                                            size: 28,
                                        }),
                                    ]
                                }),
                                new Paragraph ({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: "Crear e integrar el cronograma de actividades para el RP correspondiente del proyecto de forma manual",
                                            size: 24,
                                            break:3,
                                            color: "FF0000"
                                        })
                                    ]
                                }),
                            ],
                            properties: {
                                page: {
                                    orientation: PageOrientation.LANDSCAPE,
                                },
                            }
                        },
                        {
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Fichas descriptivas de actividades",
                                            bold: true,
                                            size: 32,
                                        }),
                                    ],
                                    alignment: "center",
                                    spacing: { after: 400 }, // Espacio después del título
                                }),
                                ...fichaActividades.flatMap((tabla, index) => [
                                    new Paragraph({
                                        children: [new TextRun({
                                            text: `Ficha de Actividad ${index + 1}`,
                                            size:28
                                        })],
                                        spacing: { after: 200 },
                                    }),
                                    tabla,
                                    new Paragraph(" "),
                                ]),
                            ],
                        }
                        
                    ],
                });

                const buffer = await Packer.toBuffer(doc);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                res.setHeader('Content-Disposition', `attachment; filename=${AnnualPlan.name}.docx`);
                res.send(buffer);
            } else {
             res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }

        } else {
          res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
    });
}

function generateXLSXAnnualPlan(req, res){
    return new Promise(async function(resolve, reject){

        let AnnualPlan
        let Activities

        const planAnnualById = await ejecutarStoredProcedure('sp_GetPlanAnualByIdplananual',[req.params.id]);
        if(planAnnualById){
            AnnualPlan = planAnnualById[0][0]
        } else {
          res.status(404).json({valido: 0, message: "No results found - AnnualPlan By ID"});
        }
        
        const activitiesByPlan = await ejecutarStoredProcedure('sp_getActividadesByPlanAnual',[req.params.id]);
        if(activitiesByPlan){
            Activities = activitiesByPlan[0]
        } else {
            res.status(404).json({valido: 0, message: "No results found - Activities By Annual Plan"});
        }

        if(AnnualPlan && Activities){
            const workbook = new ExcelJS.Workbook();

            /** HOJA PARA CRONOGRAMA - ESTE PUEDE LLEGAR A CAMBIAR TODAVÍA */
            const worksheet = workbook.addWorksheet('CPMP Section 5&6', {
                properties: { tabColor: { argb: 'FF00FF00' } }
              });
              
              worksheet.columns = [
                { header: 'Actividad', key: 'actividad', width: 30 },
                { header: 'Presupuesto (USD)', key: 'presupuesto', width: 50 },
                { header: 'SOP', key: 'sop', width: 50 },
              ];
              
              const meses = generarMesesDesdeFecha(Activities[0].actividaddatestart);
              
              meses.forEach((mes, index) => {
                const cell = worksheet.getCell(1, index + 4);
                cell.value = mes.nombre;
                worksheet.getColumn(index + 4).width = 20;
              });
              
              Activities.forEach((actividad, rowIndex) => {
                const row = worksheet.getRow(rowIndex + 2); // Fila empieza desde la 2
                row.getCell(1).value = actividad.Actividad || actividad.NombreActividad; // Columna Actividad
                row.getCell(2).value = actividad.EstimadoUSD; // Columna Presupuesto
                row.getCell(3).value = actividad.SOPdescription;
            
                meses.forEach((mes, colIndex) => {
                  const cell = row.getCell(colIndex + 4);
            
                  if (estaDentroDeRango(mes.fecha, new Date(actividad.actividaddatestart), new Date(actividad.actividaddateend))) {
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FF088F83' }
                    };
                  }
            
                  cell.value = ''; // Valor inicial vacío 
                });
              });
            

            /** HOJA PARA EL LISTADO DE ACTIVIDADES DEL PLAN ANUAL */
            const sheet = workbook.addWorksheet('Annual Plan Summary', { 
                properties: { tabColor: { argb: 'FF0000' } } 
              });
              
              sheet.columns = [
                { header: 'Proyecto', key: 'project', width: 12 },
                { header: '# RP', key: 'idrpnumber', width: 20 },
                { header: 'Metodología', key: 'SOPdescription', width: 30 },
                { header: 'Nombre actividad', key: 'NombreActividad', width: 30 },
                { header: 'Evaluador', key: 'IDUserEvaluador', width: 30 },
                { header: 'Fecha inicio', key: 'actividaddatestart', width: 30 },
                { header: 'Fecha de termino', key: 'actividaddateend', width: 30 },
                { header: 'Presupuesto total (USD)', key: 'EstimadoUSD', width: 30 },
                { header: 'Subcuenta', key: 'subcuenta', width: 30 },
                { header: 'Indicadores', key: 'Cuantitativos', width: 30 },
              ];
              
              Activities.forEach(item => {
                sheet.addRow({
                  project: AnnualPlan.ProjectName,
                  idrpnumber: 'RP' + item.idrpnumber,
                  SOPdescription: item.SOPdescription,
                  NombreActividad: item.Actividad || item.NombreActividad,
                  IDUserEvaluador: item.IDUserEvaluador,
                  actividaddatestart: item.actividaddatestart.toISOString().split('T')[0],
                  actividaddateend: item.actividaddateend.toISOString().split('T')[0],
                  EstimadoUSD: item.EstimadoUSD,
                  subcuenta: item.Ca_o_pex == 1 ?  item.nombreCapex : item.Ca_o_pex == 2 ? item.nombreOpex : '',
                  Cuantitativos: item.Cuantitativos,
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
              
              sheet.getColumn(8).eachCell((cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.numFmt = '"$"#,##0.00';
                }
              });
              
              const totalRow = sheet.addRow({
                NombreActividad: 'TOTAL',
                EstimadoUSD: { formula: `SUM(H2:H${sheet.rowCount})` },
              });
              
              totalRow.getCell(8).numFmt = '"$"#,##0.00';
              totalRow.eachCell(cell => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'right' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' },
                };
              });
            
            /** METODO DINÁMICO, PARA GENERAR N CANTIDAD DE FICHAS DE ACTIVIDAD, ACORDE A LAS REGISTRADAS EN SISTEMA (ES DECIR, SI HAY 10 EN BD, GENERARÁ 10 HOJAS) */
            for(let i = 0; i< Activities.length; i++){
                let activity = Activities[i];
                let reporting = [];
                const getreporting = await ejecutarStoredProcedure('sp_GetActividadReportingByActividad',[activity.IdActividaddata]);
                if(getreporting){
                    reporting = getreporting[0]
                } 
                let indice = i + 1
                const sheet = workbook.addWorksheet('Activity' + ' ' + indice, { properties: { tabColor: { argb: 'FF00FF00' } } });

                const titleStyle = {
                    font: { bold: true, size: 34, color: { argb: '00000000' } },
                    alignment: { vertical: 'bottom', horizontal: 'left' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3DB87B' } }, // Verde
                  };
              
                  const headerStyle = {
                    font: { bold: true, size: 12, color: { argb: 'FF000000' } },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } }, // Verde claro
                    alignment: { vertical: 'middle', horizontal: 'center' },
                  };

                  const longTextStyle = {
                    alignment: {
                      horizontal: 'left',  // Alineación horizontal a la izquierda
                      vertical: 'top',      // Alineación vertical en la parte superior
                      wrapText: true,       // Ajuste del texto en múltiples líneas
                    },
                    font: { size: 12 },
                    border: {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' },
                    },
                  };
              
                  const cellStyle = {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    border: {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' },
                    },
                  };
              
                  // Título de la hoja
                  const titleCell = sheet.getCell('C3');
                  sheet.getRow(3).height = 72;
                  titleCell.value = 'Ficha de Actividad v1.0';
                  Object.assign(titleCell, titleStyle);

                    // Estructura básica (Ajusta las celdas según la imagen de referencia)
                    sheet.mergeCells('C3:E3');
                    sheet.getCell('C3').value = 'Ficha de Actividad v1.0';

                    sheet.getCell('C4').value = 'PROYECTO';
                    sheet.getCell('C5').value = AnnualPlan.ProjectName;
                    sheet.getCell('D4').value = '# RP';
                    sheet.getCell('D5').value = activity.RP_Number;
                    sheet.getCell('E4').value = 'FECHA';
                    sheet.getCell('E5').value = activity.DateCreateActividad.toISOString().split('T')[0];

                    sheet.getCell('C7').value = 'NOMBRE ACTIVIDAD';
                    sheet.getCell('C8').value = activity.Actividad || activity.NombreActividad;
                    sheet.getCell('D7').value = 'SUBCUENTA PROYECTO'; // FALTA AGREGAR SUBCUENTA, YA SEA CAPEX U OPEX
                    sheet.getCell('D8').value = activity.nombreCapex ? activity.nombreCapex : activity.nombreOpex; // FALTA AGREGAR SUBCUENTA, YA SEA CAPEX U OPEX
                    sheet.getCell('E7').value = 'ID ACTIVIDAD';
                    sheet.getCell('E8').value = activity.IdActividaddata;

                    sheet.mergeCells('C10:D10');
                    sheet.mergeCells('C11:D11');

                    [['C4','D4','E4','C7','D7','E7','C10','E10','C13','D13','E13','C16','C29','D29','E29','C36','D36','E36','C38','D38', 'C35']].flat().forEach((cell) => Object.assign(sheet.getCell(cell), headerStyle));
                    [['C5','D5','E5', 'C8','D8','E8', 'C11','E11','C14','D14','E14','C37','D37','E37','C39','D39']].flat().forEach((cell) => Object.assign(sheet.getCell(cell), cellStyle));
                    
                    sheet.getCell('C10').value = 'OBJETIVO';
                    sheet.getCell('C11').value = activity.objetivo;
                    Object.assign(sheet.getCell('C11'), longTextStyle);

                    sheet.getCell('E10').value = 'METODOLOGÍA';
                    sheet.getCell('E11').value = activity.SOPdescription;

                    sheet.getCell('C13').value = 'FECHA ESTIMADA INICIO';
                    sheet.getCell('C14').value = activity.actividaddatestart.toISOString().split('T')[0];
                    sheet.getCell('D13').value = 'FECHA ESTIMADA TERMINO';
                    sheet.getCell('D14').value = activity.actividaddateend.toISOString().split('T')[0];
                    sheet.getCell('E13').value = 'PRESUPUESTO TOTAL (USD)';
                    sheet.getCell('E14').value = activity.EstimadoUSD;

                    // Indicadores
                    sheet.mergeCells('C16:D16');
                    sheet.getCell('C16').value = 'INDICADORES';

                    sheet.getCell('C17').value = 'Cuantitativos';
                    // sheet.getCell('C18').value = activity.Cuantitativos;
                    let indicadorescuantitativos = activity.Cuantitativos ? activity.Cuantitativos.split('||') : [];
                    indicadorescuantitativos.forEach((evidence, index) => {
                        const row = 18 + index;
                        sheet.getCell(`C${row}`).value = evidence;

                    })

                    sheet.getCell('C22').value = 'Cualitativos';
                    sheet.getCell('C23').value = activity.Cualitativos;
                    Object.assign(sheet.getCell('C23'), longTextStyle);

                    // Roles y entrega de evidencias
                    sheet.getCell('C29').value = '¿Quién?';
                    sheet.getCell('D29').value = '¿Cómo?';
                    sheet.getCell('E29').value = '¿Cuándo?';

                    reporting.forEach((evidence, index) => {
                    const row = 30 + index;
                    sheet.getCell(`C${row}`).value = evidence.ReportingQuien;
                    Object.assign(`C${row}`, cellStyle);
                    sheet.getCell(`D${row}`).value = evidence.ReportingComo;
                    Object.assign(`D${row}`, cellStyle);
                    sheet.getCell(`E${row}`).value = evidence.ReportingCuando.toISOString().split('T')[0];
                    Object.assign(`E${row}`, cellStyle);
                    });

                    sheet.mergeCells('C35:E35');
                    sheet.getCell('C35').value = 'ROLES PARA REALIZAR LA ACTIVIDAD';
                    sheet.getCell('C36').value = 'Seguimiento';
                    sheet.getCell('C37').value = activity.IDUserSeguimiento;

                    sheet.getCell('D36').value = 'Coordinador';
                    sheet.getCell('D37').value = activity.IDUserSeguimiento;

                    sheet.getCell('E36').value = 'Ejecutor de campo';
                    sheet.getCell('E37').value = activity.UserEjecutordeCampo;

                    sheet.getCell('C38').value = 'Supervisor';
                    sheet.getCell('C39').value = activity.UserSupervisor;

                    sheet.getCell('D38').value = 'Evaluador';
                    sheet.getCell('D39').value = activity.IDUserEvaluador;

                    sheet.columns = [
                        // { key: 'empty', width: 5 },
                        { key: 'A', width: 4.71 },
                        { key: 'B', width: 1.57 },
                        { key: 'C', width: 60 },
                        { key: 'D', width: 50 },
                        { key: 'E', width: 40 },
                        { key: 'F', width: 1.57 },
                    ];

                    if(Activities.length == i+1){
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', `attachment; filename=${AnnualPlan.name}.xlsx`);

                        await workbook.xlsx.write(res);
                        res.end();
                    }
            }
        } else {
            res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
    });
}

function generateXLSXDraft(req, res){
    return new Promise(async function(resolve, reject){

        let AnnualPlan
        let Activities

        const planAnnualById = await ejecutarStoredProcedure('sp_GetPlanAnualByIdplananual',[req.params.id]);
        if(planAnnualById){
            AnnualPlan = planAnnualById[0][0]
        } else {
          res.status(404).json({valido: 0, message: "No results found - AnnualPlan By ID"});
        }
        
        const activitiesByPlan = await ejecutarStoredProcedure('sp_GetActivitiesDraft',[req.params.id, req.params.rp]);
        if(activitiesByPlan){
            Activities = activitiesByPlan[0]
        } else {
            res.status(404).json({valido: 0, message: "No results found - Activities By Annual Plan"});
        }

        if(Activities){
            const workbook = new ExcelJS.Workbook();

            /** HOJA PARA CRONOGRAMA - ESTE PUEDE LLEGAR A CAMBIAR TODAVÍA */
            /*
            const worksheet = workbook.addWorksheet('CPMP Section 5&6', {
                properties: { tabColor: { argb: 'FF00FF00' } }
              });
              
              worksheet.columns = [
                { header: 'Actividad', key: 'actividad', width: 30 },
                { header: 'Presupuesto (USD)', key: 'presupuesto', width: 50 },
                { header: 'SOP', key: 'sop', width: 50 },
              ];
              
              const meses = generarMesesDesdeFecha(Activities[0].actividaddatestart);
              
              meses.forEach((mes, index) => {
                const cell = worksheet.getCell(1, index + 4);
                cell.value = mes.nombre;
                worksheet.getColumn(index + 4).width = 20;
              });
              
              Activities.forEach((actividad, rowIndex) => {
                const row = worksheet.getRow(rowIndex + 2); // Fila empieza desde la 2
                row.getCell(1).value = actividad.Actividad || actividad.NombreActividad; // Columna Actividad
                row.getCell(2).value = actividad.EstimadoUSD; // Columna Presupuesto
                row.getCell(3).value = actividad.SOPdescription;
            
                meses.forEach((mes, colIndex) => {
                  const cell = row.getCell(colIndex + 4);
            
                  if (estaDentroDeRango(mes.fecha, new Date(actividad.actividaddatestart), new Date(actividad.actividaddateend))) {
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FF088F83' }
                    };
                  }
            
                  cell.value = ''; // Valor inicial vacío 
                });
              });
            */

            /** HOJA PARA EL LISTADO DE ACTIVIDADES DEL PLAN ANUAL */
            const sheet = workbook.addWorksheet('Annual Plan Summary', { 
                properties: { tabColor: { argb: 'FF0000' } } 
              });
              
              sheet.columns = [
                { header: 'Proyecto', key: 'project', width: 12 },
                { header: '# RP', key: 'idrpnumber', width: 20 },
                { header: 'Metodología', key: 'SOPdescription', width: 30 },
                { header: 'Nombre actividad', key: 'NombreActividad', width: 30 },
                { header: 'Evaluador', key: 'IDUserEvaluador', width: 30 },
                { header: 'Fecha inicio', key: 'actividaddatestart', width: 30 },
                { header: 'Fecha de termino', key: 'actividaddateend', width: 30 },
                { header: 'Presupuesto total (USD)', key: 'EstimadoUSD', width: 30 },
                { header: 'Subcuenta', key: 'subcuenta', width: 30 },
                { header: 'Indicadores', key: 'Cuantitativos', width: 30 },
              ];

              sheet.views = [{ state: 'frozen', ySplit: 1 }];
              
              Activities.forEach(item => {
                sheet.addRow({
                  project: item.ProjectName,
                  idrpnumber: item.RP_Number,
                  SOPdescription: item.SOPdescription,
                  NombreActividad: item.Actividad,
                  IDUserEvaluador: item.IDUserEvaluador,
                  actividaddatestart: item.actividaddatestart.toISOString().split('T')[0],
                  actividaddateend: item.actividaddateend.toISOString().split('T')[0],
                  EstimadoUSD: item.EstimadoUSD,
                  subcuenta: item.Ca_o_pex == 1 ?  item.nombreCapex : item.Ca_o_pex == 2 ? item.nombreOpex : '',
                  Cuantitativos: item.Cuantitativos,
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
              
              sheet.getColumn(8).eachCell((cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.numFmt = '"$"#,##0.00';
                }
              });
              
              const totalRow = sheet.addRow({
                NombreActividad: 'TOTAL',
                EstimadoUSD: { formula: `SUM(H2:H${sheet.rowCount})` },
              });
              
              totalRow.getCell(8).numFmt = '"$"#,##0.00';
              totalRow.eachCell(cell => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'right' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' },
                };
              });
            
            /** METODO DINÁMICO, PARA GENERAR N CANTIDAD DE FICHAS DE ACTIVIDAD, ACORDE A LAS REGISTRADAS EN SISTEMA (ES DECIR, SI HAY 10 EN BD, GENERARÁ 10 HOJAS) */
            for(let i = 0; i< Activities.length; i++){
                let activity = Activities[i];
                let reporting = [];
                const getreporting = await ejecutarStoredProcedure('sp_GetActividadReportingByActividad',[activity.IdActividaddata]);
                if(getreporting){
                    reporting = getreporting[0]
                } 
                let indice = i + 1
                const sheet = workbook.addWorksheet('Activity' + ' ' + indice, { properties: { tabColor: { argb: 'FF00FF00' } } });

                const titleStyle = {
                    font: { bold: true, size: 34, color: { argb: '00000000' } },
                    alignment: { vertical: 'bottom', horizontal: 'left' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3DB87B' } }, // Verde
                  };
              
                  const headerStyle = {
                    font: { bold: true, size: 12, color: { argb: 'FF000000' } },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } }, // Verde claro
                    alignment: { vertical: 'middle', horizontal: 'center' },
                  };

                  const longTextStyle = {
                    alignment: {
                      horizontal: 'left',  // Alineación horizontal a la izquierda
                      vertical: 'top',      // Alineación vertical en la parte superior
                      wrapText: true,       // Ajuste del texto en múltiples líneas
                    },
                    font: { size: 12 },
                    border: {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' },
                    },
                  };
              
                  const cellStyle = {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                    border: {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' },
                    },
                  };
              
                  // Título de la hoja
                  const titleCell = sheet.getCell('C3');
                  sheet.getRow(3).height = 72;
                  titleCell.value = 'Ficha de Actividad v1.0';
                  Object.assign(titleCell, titleStyle);

                    // Estructura básica (Ajusta las celdas según la imagen de referencia)
                    sheet.mergeCells('C3:E3');
                    sheet.getCell('C3').value = 'Ficha de Actividad v1.0';

                    sheet.getCell('C4').value = 'PROYECTO';
                    sheet.getCell('C5').value = activity.ProjectName;
                    sheet.getCell('D4').value = '# RP';
                    sheet.getCell('D5').value = activity.RP_Number;
                    sheet.getCell('E4').value = 'FECHA';
                    sheet.getCell('E5').value = activity.DateCreateActividad.toISOString().split('T')[0];

                    sheet.getCell('C7').value = 'NOMBRE ACTIVIDAD';
                    sheet.getCell('C8').value = activity.Actividad || activity.NombreActividad;
                    sheet.getCell('D7').value = 'SUBCUENTA PROYECTO'; // FALTA AGREGAR SUBCUENTA, YA SEA CAPEX U OPEX
                    sheet.getCell('D8').value = activity.nombreCapex ? activity.nombreCapex : activity.nombreOpex; // FALTA AGREGAR SUBCUENTA, YA SEA CAPEX U OPEX
                    sheet.getCell('E7').value = 'ID ACTIVIDAD';
                    sheet.getCell('E8').value = activity.IdActividaddata;

                    sheet.mergeCells('C10:D10');
                    sheet.mergeCells('C11:D11');

                    [['C4','D4','E4','C7','D7','E7','C10','E10','C13','D13','E13','C16','C29','D29','E29','C36','D36','E36','C38','D38', 'C35']].flat().forEach((cell) => Object.assign(sheet.getCell(cell), headerStyle));
                    [['C5','D5','E5', 'C8','D8','E8', 'C11','E11','C14','D14','E14','C37','D37','E37','C39','D39']].flat().forEach((cell) => Object.assign(sheet.getCell(cell), cellStyle));
                    
                    sheet.getCell('C10').value = 'OBJETIVO';
                    sheet.getCell('C11').value = activity.objetivo;
                    Object.assign(sheet.getCell('C11'), longTextStyle);

                    sheet.getCell('E10').value = 'METODOLOGÍA';
                    sheet.getCell('E11').value = activity.SOPdescription;

                    sheet.getCell('C13').value = 'FECHA ESTIMADA INICIO';
                    sheet.getCell('C14').value = activity.actividaddatestart.toISOString().split('T')[0];
                    sheet.getCell('D13').value = 'FECHA ESTIMADA TERMINO';
                    sheet.getCell('D14').value = activity.actividaddateend.toISOString().split('T')[0];
                    sheet.getCell('E13').value = 'PRESUPUESTO TOTAL (USD)';
                    sheet.getCell('E14').value = activity.EstimadoUSD;

                    // Indicadores
                    sheet.mergeCells('C16:D16');
                    sheet.getCell('C16').value = 'INDICADORES';

                    sheet.getCell('C17').value = 'Cuantitativos';
                    // sheet.getCell('C18').value = activity.Cuantitativos;
                    let indicadorescuantitativos = activity.Cuantitativos ? activity.Cuantitativos.split('||') : [];
                    indicadorescuantitativos.forEach((evidence, index) => {
                        const row = 18 + index;
                        sheet.getCell(`C${row}`).value = evidence;

                    })

                    sheet.getCell('C22').value = 'Cualitativos';
                    sheet.getCell('C23').value = activity.Cualitativos;
                    Object.assign(sheet.getCell('C23'), longTextStyle);

                    // Roles y entrega de evidencias
                    sheet.getCell('C29').value = '¿Quién?';
                    sheet.getCell('D29').value = '¿Cómo?';
                    sheet.getCell('E29').value = '¿Cuándo?';

                    reporting.forEach((evidence, index) => {
                    const row = 30 + index;
                    sheet.getCell(`C${row}`).value = evidence.ReportingQuien;
                    Object.assign(`C${row}`, cellStyle);
                    sheet.getCell(`D${row}`).value = evidence.ReportingComo;
                    Object.assign(`D${row}`, cellStyle);
                    sheet.getCell(`E${row}`).value = evidence.ReportingCuando.toISOString().split('T')[0];
                    Object.assign(`E${row}`, cellStyle);
                    });

                    sheet.mergeCells('C35:E35');
                    sheet.getCell('C35').value = 'ROLES PARA REALIZAR LA ACTIVIDAD';
                    sheet.getCell('C36').value = 'Seguimiento';
                    sheet.getCell('C37').value = activity.IDUserSeguimiento;

                    sheet.getCell('D36').value = 'Coordinador';
                    sheet.getCell('D37').value = activity.IDUserSeguimiento;

                    sheet.getCell('E36').value = 'Ejecutor de campo';
                    sheet.getCell('E37').value = activity.UserEjecutordeCampo;

                    sheet.getCell('C38').value = 'Supervisor';
                    sheet.getCell('C39').value = activity.UserSupervisor;

                    sheet.getCell('D38').value = 'Evaluador';
                    sheet.getCell('D39').value = activity.IDUserEvaluador;

                    sheet.columns = [
                        // { key: 'empty', width: 5 },
                        { key: 'A', width: 4.71 },
                        { key: 'B', width: 1.57 },
                        { key: 'C', width: 60 },
                        { key: 'D', width: 50 },
                        { key: 'E', width: 40 },
                        { key: 'F', width: 1.57 },
                    ];

                    if(Activities.length == i+1){
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', `attachment; filename=draftAnnualPlan.xlsx`);

                        await workbook.xlsx.write(res);
                        res.end();
                    }
            }
        } else {
            res.status(500).json({valido: 0, message: "Was an error, please, try again"});
        }
    });
}

/** FUNCIONES AUXILIARES */
function generarMesesDesdeFecha(fechaInicial) {
    const meses = [];
    let fecha = new Date(fechaInicial);
  
    for (let i = 0; i < 12; i++) {
      const mes = fecha.toLocaleString('default', { month: 'long' }); 
      const año = fecha.getFullYear(); 
      meses.push({ nombre: `${mes} ${año}`, fecha: new Date(fecha) });
      fecha.setMonth(fecha.getMonth() + 1); 
    }
    return meses;
}

function estaDentroDeRango(fecha, inicio, fin) {
    const fechaComparacion = new Date(fecha);
    fechaComparacion.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    return fechaComparacion >= inicio && fechaComparacion <= fin;
}

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    generateDocxAnnualPlan,
    generateXLSXAnnualPlan,
    generateXLSXDraft,
}