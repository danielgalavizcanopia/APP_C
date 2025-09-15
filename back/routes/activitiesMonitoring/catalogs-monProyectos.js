const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getLeadDesarrollo, getTypeActivities, getMetricas, getActivitiesProjects, getActivitiesStatus, getCuentasCapex, getSubCuentasCapex, getCuentasOpex, getActividadesByProject,
    getStatusReporteoActividades
 } = require('../../controllers/activitiesMonitoring/catalogs-monProyectos');


router.get('/get_typeActivities', authMiddleware, getTypeActivities);
router.get('/get_leadDesarrollo', authMiddleware, getLeadDesarrollo);
router.get('/get_metricas', authMiddleware, getMetricas);
router.get('/get_ActivitiesProjects', authMiddleware, getActivitiesProjects);
router.get('/get_statusdesarrollo', authMiddleware, getActivitiesStatus);
router.get('/get_CCapex', authMiddleware, getCuentasCapex);
router.get('/get_SubCCapex', authMiddleware, getSubCuentasCapex);
router.get('/get_COpex', authMiddleware, getCuentasOpex);
router.get('/getStatusReporteoActividades', authMiddleware, getStatusReporteoActividades);


router.get('/getActividadesByProject/:rpnumber/:idprojects', authMiddleware, getActividadesByProject);

module.exports = router;