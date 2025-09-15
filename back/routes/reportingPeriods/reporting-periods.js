const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getReportingPeriods,
    setReportingPeriods,
    getReportingPeriodsByID,
    getReportingPeriodsVolumeYear,
    getReportingPeriodsSummary,
    generateXLSXReportingPeriod
 } = require('../../controllers/reportingPeriods/reporting-periods');

router.get('/getReportingPeriods/:id', authMiddleware, getReportingPeriods);
router.post('/setReportingPeriods', authMiddleware, setReportingPeriods);
router.get('/getReportingPeriodsByID/:id', authMiddleware, getReportingPeriodsByID);
router.get('/getReportingPeriodsVolumeYear/:id', authMiddleware, getReportingPeriodsVolumeYear);
router.get('/getReportingPeriodsSummary/:id', authMiddleware, getReportingPeriodsSummary);
router.get('/generateXLSXReportingPeriod/:id', authMiddleware, generateXLSXReportingPeriod);

module.exports = router;