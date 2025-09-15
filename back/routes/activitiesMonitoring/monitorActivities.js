const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
        getMonitorActivities,
        getSummaryActivity,
        setReporteoActivities,
        getReportActDetailById,
        getActivitiesApproved,
        setStatusReporteoactivities,
        getReporteActividadByProject, 
        getReporteoByActivity, 
        getMonitorDates,
        generateDatesXlsxReport,
        generateReporteActividadByProject,
        generateKPIGeneralReport,
 } = require('../../controllers/activitiesMonitoring/monitorActivities');

router.get('/getMonitorActivities/:id', authMiddleware, getMonitorActivities);
router.get('/getSummaryActivity/:id', authMiddleware, getSummaryActivity);

router.get('/getActivitiesApproved/:idrpnumber/:idprojects', authMiddleware, getActivitiesApproved);
router.get('/getReportActDetailById/:id', authMiddleware, getReportActDetailById);
router.post('/setReporteoActivities', authMiddleware, setReporteoActivities);
router.get('/getReporteActividadByProject/:rpnumber/:idprojects', authMiddleware, getReporteActividadByProject);
router.get('/getReporteoByActivity/:idactividad', authMiddleware, getReporteoByActivity);
router.get('/getMonitorDates/:rpnumber/:idprojects', authMiddleware, getMonitorDates);
// router.get('/getBudgetTrackerByProjectRP/:idprojects/:rpnumber', authMiddleware, getBudgetTrackerByProjectRP);
router.get('/generateReporteActividadByProject/:rpnumber/:idprojects', authMiddleware, generateReporteActividadByProject);
router.get('/generateDatesXlsxReport/:rpnumber/:idprojects', authMiddleware, generateDatesXlsxReport);
router.get('/generateKPIGeneralReport', authMiddleware, generateKPIGeneralReport);
// router.get('/generateXLSXBT/:idprojects/:rpnumber', authMiddleware, generateXLSXBT);
router.post('/setStatusReporteoactivities', authMiddleware, setStatusReporteoactivities);


module.exports = router;