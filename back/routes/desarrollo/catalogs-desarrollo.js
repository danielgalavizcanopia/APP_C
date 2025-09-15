const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const {     
    getLicencesPermits,
    getLeadDesarrollo,
    getDevelopmentStatus,
    getRegistry,
    getMethodology,
    getConfidenceoffrontcost,
    getCBAcalculatorversion,
    getConfidenceofcreditingactivityarea,
    getProjectcondition,
    getERScalculatorversion,
    getMercuriaddstatus,
    getEstimatepermanence,
    getEstimateleakeage,
    getEstimatedmrvrequirements,
    getRegistrationroute
 } = require('../../controllers/desarrollo/catalogs-desarrollo');

router.get('/getLicencesPermits', authMiddleware, getLicencesPermits);
router.get('/getLeadDesarrollo', authMiddleware, getLeadDesarrollo);
router.get('/getDevelopmentStatus', authMiddleware, getDevelopmentStatus);
router.get('/getRegistry', authMiddleware, getRegistry);
router.get('/getMethodology', authMiddleware, getMethodology);
router.get('/getConfidenceoffrontcost', authMiddleware, getConfidenceoffrontcost);
router.get('/getCBAcalculatorversion', authMiddleware, getCBAcalculatorversion);
router.get('/getConfidenceofcreditingactivityarea', authMiddleware, getConfidenceofcreditingactivityarea);
router.get('/getProjectcondition', authMiddleware, getProjectcondition);
router.get('/getERScalculatorversion', authMiddleware, getERScalculatorversion);
router.get('/getMercuriaddstatus', authMiddleware, getMercuriaddstatus);
router.get('/getEstimatepermanence', authMiddleware, getEstimatepermanence);
router.get('/getEstimateleakeage', authMiddleware, getEstimateleakeage);
router.get('/getEstimatedmrvrequirements', authMiddleware, getEstimatedmrvrequirements);
router.get('/getRegistrationroute', authMiddleware, getRegistrationroute);

module.exports = router;