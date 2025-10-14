const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    setIncidences,
    setInvolvedSIL,
    getCanopiaInvolvedByIncidence,
    getIndicencesByProject,
    setIncidenceStatus,
    setEvidencesByIncidences,
    getEvidencesByIncidence,
    getHistoryStatus,
    setDeleteIncidences
} = require('../../controllers/incidences/IncidencesReports');
const {
    getIncidencesReportXLSX,
    getGeneralIncidencesReportsXLSX,
} = require('../../controllers/incidences/xlsx-incidences')

router.post('/setIncidences', authMiddleware, setIncidences);
router.post('/setIncidenceStatus', authMiddleware, setIncidenceStatus);
router.post('/setInvolvedSIL', authMiddleware, setInvolvedSIL);
router.post('/setEvidencesByIncidences', authMiddleware, setEvidencesByIncidences);
router.get('/getEvidencesByIncidence/:id', authMiddleware, getEvidencesByIncidence);
router.get('/getCanopiaInvolvedByIncidence/:id', authMiddleware, getCanopiaInvolvedByIncidence);
router.get('/getIndicencesByProject/:id', authMiddleware, getIndicencesByProject);
router.get('/getHistoryStatus/:id', authMiddleware, getHistoryStatus);
router.post('/setDeleteIncidences', authMiddleware, setDeleteIncidences);

router.get('/getIncidencesReportXLSX/:id', authMiddleware, getIncidencesReportXLSX);
router.get('/getGeneralIncidencesReportsXLSX', authMiddleware, getGeneralIncidencesReportsXLSX);

module.exports = router;
