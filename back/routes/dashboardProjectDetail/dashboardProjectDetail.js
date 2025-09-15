const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const { 
    getprojectOverview,
    getSummaryByActivitiesTracker,
    getSummaryBenefitTracker,
    getTopODSByProject,
    getActivitiesByOds,
    getActivityDetailByOdsAndProject,
    getIncidenceByProject,
    getKPIActivitiesByActivity,
    getActivitiesByProject,
    getMacroProcessCatalog,
    getKeyMilestonesByMacroprocess,
    getCountEvidencesNIncidences,
 } = require('../../controllers/dashboardProjectDetail/dashboardProjectDetail');

router.get('/getprojectOverview/:id', authMiddleware, getprojectOverview);
router.get('/getSummaryByActivitiesTracker/:id', authMiddleware, getSummaryByActivitiesTracker);
router.get('/getSummaryBenefitTracker/:id', authMiddleware, getSummaryBenefitTracker);
router.get('/getTopODSByProject/:id', authMiddleware, getTopODSByProject);
router.get('/getActivitiesByOds/:id/:idods', authMiddleware, getActivitiesByOds);
router.get('/getActivityDetailByOdsAndProject/:id', authMiddleware, getActivityDetailByOdsAndProject);
router.get('/getIncidenceByProject/:id', authMiddleware, getIncidenceByProject);
router.get('/getKPIActivitiesByActivity/:id', authMiddleware, getKPIActivitiesByActivity);
router.get('/getActivitiesByProject/:id', authMiddleware, getActivitiesByProject);
router.get('/getMacroProcessCatalog', authMiddleware, getMacroProcessCatalog);
router.get('/getKeyMilestonesByMacroprocess/:idp/:idm', authMiddleware, getKeyMilestonesByMacroprocess);
router.get('/getCountEvidencesNIncidences/:id', authMiddleware, getCountEvidencesNIncidences);

module.exports = router;