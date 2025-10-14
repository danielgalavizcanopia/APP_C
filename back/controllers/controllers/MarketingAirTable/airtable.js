var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_ACCESSTOKEN}).base('app2aOiWzsbyVtCW3');

async function getDataTestAirTable(req, res){
    try {
    let registros = []
    base('Actividades de sistemas').select({
        // maxRecords: 10,
        view: "Actividaedes de sistemas"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function(record) {
            registros.push({
                Actividad: record.get('Actividades SISTEMAS'),
                Notas: record.get('Notes'),
            });
        });

        res.status(201).json({valido: 1, result: registros });
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
    } catch (error) {
        console.log(error);
    }
}

async function createDataTestAirTable(req, res){
    try {
        const body = req.body
        base('Actividades de sistemas').create([
        { 
            "fields": {
            "Actividades SISTEMAS": body.ActivityName,
            "Assignee": body.AsignadoA,
            "Status": body.Status
            }
        },
        ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }


        if(records.length > 0){
            res.status(201).json({valido: 1, result: records[0].getId() });
        }
    });
    } catch (error) {
        console.log(error);
    }
}

async function updateDataTestAirTable(req, res) {
    try {
        const body = req.body
        base('Actividades de sistemas').update([
            {
                "id": body.id,
                "fields": {
                "Actividades SISTEMAS": body.ActivityName,
                "Assignee": body.AsignadoA,
                "Status": body.Status
                }
            },
        ], function(err, records) {
            if (err) {
                console.error(err);
                return;
            }

            if(records.length > 0){
                res.status(201).json({valido: 1, result: records[0].getId() });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function deleteDataTestAirTable(req, res) {
    try {
        const body = req.body

        base('Actividades de sistemas').destroy([body.id], function(err, deletedRecords) {
            if (err) {
                console.error(err);
                return;
            }
        
            res.status(201).json({valido: 1, result: deletedRecords.length + " record deleted" });
        });
    } catch (error) {
        console.log(error);
    }
}


/** ENDPOINTS OFICIALES */
async function setImportAcivityEventCatalog(req, res){
    try {
        const body = req.body;

        if(body){
            
            const Activity = body.activity;
            const reporting = body.reporting.sort((a, b) => new Date(b.DateCreate) - new Date(a.DateCreate));;
            const StartDate = reporting[0]?.begindate
            const EndDate = reporting[0]?.enddate
            const counts = body.totalCount;

            let textReporting = reporting
                .map(item => `${item.Cuantitativos} - ${item.Metrica} - ${item.estimado} - ${item.AvanceCuantitativo} - ${item.calculatedprogress} - ${item.participatingW} - ${item.participatingM} - ${item.NumJornales}`)
                .join('\n');

            // const projects = await getAirtableProjects();
            
            // const projectSelected = projects.find(project => project.ID == Activity.Id_ProyectoCAR)

            base('Eventos').create([
                { 
                    "fields": {
        
                        "Name": Activity.Actividad,
                        "Categoría": Activity.CategoriaMarketing,
                        "Fecha de Inicio": StartDate.split('T')[0],
                        "Fecha de Finalización": EndDate.split('T')[0],
                        "Descripción": textReporting,
                        "No. de Asistentes": counts.participatingM + counts.participatingW,
                        // "Proyecto": [
                        //     projectSelected.record_id
                        // ],
                        "Status": Activity.IdstatusReporteoActividades != 3 ? "" : "Realizado",
                    }
                },
            ], function(err, records) {
            if (err) {
                console.error(err);
                return;
            } 
    
            if(records.length > 0){
                res.status(201).json({valido: 1, result: records[0].getId() });
            }
        });
        }
        

    } catch (error) {
        console.log(error);
    }
}

async function getAirtableProjects() {
  try {
    const registros = await new Promise((resolve, reject) => {
      base('Proyectos').select({ view: 'Grid view' }).all(function(err, records) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const data = records.map(record => record.fields);
          resolve(data);
        }
      });
    });

    return registros;
    
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    getDataTestAirTable,
    createDataTestAirTable,
    updateDataTestAirTable,
    deleteDataTestAirTable,

    /** REAL ENDPOINTS */
    setImportAcivityEventCatalog,
}