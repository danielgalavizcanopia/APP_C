const { redisClient, connectRedis } = require('./config/redisConfig');

const express = require('express'); 
const app = express(); 
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require("./routes/users");

const emailSRoutes = require("./routes/emails/email");

const catalogosRoutes = require("./routes/catalogs");
const catalogosOriginationRoutes = require("./routes/originacion/catalogs-origination");

const catalogosSIGRoutes = require("./routes/SIG/catalogos-sig");
const projectsRoutes = require("./routes/projects");

const IncidenceCTRoutes = require("./routes/incidences/catalogs-incidences");
const incidencesRoutes = require("./routes/incidences/IncidencesReports");

const originationRoutes = require("./routes/originacion/originacion");
const areaProyectoRoutes =  require('./routes/SIG/area-proyecto');

const activityAreaRoutes = require("./routes/SIG/activity-area");
const pedAreaRoutes = require("./routes/SIG/ped-area");

const monitorPRoutes = require("./routes/activitiesMonitoring/catalogs-monProyectos")
const monitorActivitiesRoutes = require("./routes/activitiesMonitoring/monitorActivities")

const legalCRoutes = require("./routes/legal/catalogs-legal")
const legalRoutes = require("./routes/legal/legal")

const MRVCRoutes = require("./routes/mrv/catalogs.mrv")
const MRVRoutes = require("./routes/mrv/MRV")

const SalvaguardaCRoutes = require("./routes/salvaguardas/catalogs-salvaguarda")
const SalvaguardasRoutes = require("./routes/salvaguardas/salvaguardas")

const CostsRoutes = require("./routes/costs")

const BitacoraProjectsCRoutes = require("./routes/bitacora/catalogs-bitacora")
const BitacoraProjectRoutes = require("./routes/bitacora/bitacora")

const ReportingPeriodsRoutes = require("./routes/reportingPeriods/reporting-periods")
const ReportingPeriodsCRoutes = require("./routes/reportingPeriods/catalogs-reportingPeriods")

const notificacionRoutes = require("./routes/notificaciones");
const monitorSummaryRoutes = require("./routes/financialMonitoring/monitorSummary")

const ImplementationRoutes = require("./routes/implementation/implementationPlan")
const ImplementationCRoutes = require("./routes/implementation/catalogs-implementationPlan")

const DesarrolloRoutes = require("./routes/desarrollo/desarrollo")
const DesarrolloCatalogs = require("./routes/desarrollo/catalogs-desarrollo")

const DashboardprojectRoutes = require("./routes/dashboardProjectDetail/dashboardProjectDetail")


const MarketingRoutes = require("./routes/Marketing/marketing");

const settlementRoutes = require("./routes/settlement/settlement");
const settlementCRoutes = require("./routes/settlement/catalog-settlement");

const summaryCostRoutes = require("./routes/summaryCost/summaryCost")


/** TOOLS ROUTES */
const toolsRoutes = require("./routes/tools/tools")
const BitCtRoutes = require("./routes/tools/bitacoraAdminCatalogs/bitacoraAdminCt")
const SOPCtRoutes = require("./routes/tools/SOPAdminCatalogs/SOPadmincatalogs")
const ActCtRoutes = require("./routes/tools/activities")

const dotenv = require("dotenv");
dotenv.config();


/** CONEXIÓN A BASE DE DATOS */
const connection = require('./config/config');
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

const puerto = 3004;

app.set('port',( puerto ))
app.set('json spaces', 2)

//Configuraciones
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/CanopiaService", emailSRoutes);

app.use("/", authRoutes);
app.use("/notificacion", notificacionRoutes);

app.use("/catalogos", catalogosRoutes);
app.use("/proyectos", projectsRoutes);

app.use("/Originacioncatalogos", catalogosOriginationRoutes);
app.use("/Originacion", originationRoutes);

app.use("/ProjectAreaSig", areaProyectoRoutes);
app.use("/activityarea", activityAreaRoutes);
app.use("/ped", pedAreaRoutes);
app.use("/sigcatalogos", catalogosSIGRoutes);



app.use("/MonitorCatalogo", monitorPRoutes);
app.use("/MonitorActivities", monitorActivitiesRoutes);

app.use("/MonitorSummary", monitorSummaryRoutes);

app.use("/LegalCatalogo", legalCRoutes);
app.use("/Legal", legalRoutes);

app.use("/MRVCatalogo", MRVCRoutes);
app.use("/MRV", MRVRoutes);

app.use("/SalvaguardaCatalogos", SalvaguardaCRoutes);
app.use("/Salvaguardas", SalvaguardasRoutes);

app.use("/Costs", CostsRoutes);

app.use("/BitacoraCatalogos", BitacoraProjectsCRoutes);
app.use("/Bitacora", BitacoraProjectRoutes);

app.use("/RP", ReportingPeriodsRoutes);
app.use("/RpCatalogo", ReportingPeriodsCRoutes);

app.use("/Desarrollo", DesarrolloRoutes);
app.use("/DesarrolloCatalogs", DesarrolloCatalogs);

app.use("/tools", toolsRoutes);
app.use("/toolsLog", BitCtRoutes);
app.use("/toolsSOP", SOPCtRoutes);
app.use("/Activities", ActCtRoutes);

app.use("/Implementation",ImplementationRoutes);
app.use("/implementationCatalogs", ImplementationCRoutes);

app.use("/IncidenceCatalogs",IncidenceCTRoutes);
app.use("/Incidence",incidencesRoutes);

app.use("/dashboards",DashboardprojectRoutes)

app.use("/marketing",MarketingRoutes)
app.use("/settlement", settlementRoutes);
app.use("/settlementCatalogs", settlementCRoutes);

app.use("/summaryCost", summaryCostRoutes);


/** SERVIR DOCUMENTOS ESTATICOS */
app.use('/media', express.static(path.join(__dirname, 'media')));

app.use('/media/bitacora', express.static(path.join(__dirname, 'media/bitacora')));
app.use('/media/implementation', express.static(path.join(__dirname, 'media/implementation')));
app.use('/images', express.static(path.join(__dirname, 'utils', 'images')));


//Iniciando el servidor, escuchando...
// const server = app.listen(app.get('port'), () => {
//     console.log(`Server listening on port ${app.get('port')}`);
// });
connectRedis()
    .then(() => {
    const server = app.listen(app.get('port'), () => {
        console.log(`🚀 Server listening on port ${app.get('port')}`);
    });

    // Capturar errores relacionados con el servidor
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Error: El puerto ${puerto} está en uso. Por favor, usa otro puerto o detén el proceso que lo está ocupando.`);
        } else {
            console.error('Error del servidor:', error);
        }
    });
    })
    .catch(err => {
    console.error('❌ Error al conectar con Redis:', err);
    process.exit(1); // Cerrar si no se conecta a Redis
});

