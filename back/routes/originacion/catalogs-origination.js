const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const { getImplementationPartner,
        getLandTernureType,
        getProjectType,
        getProgram,
        getOriginationLead,
        getOriginationPromoter,
        getOriginationStatus,
        getApprovedBuyer,
        getProspectPriority,
        getProjectAlive,

 } = require('../../controllers/originacion/catalogs-origination');

router.get('/ctimplpar', authMiddleware, getImplementationPartner);
router.get('/ctLandtenure', authMiddleware, getLandTernureType);
router.get('/ctprojecttype', authMiddleware, getProjectType);
router.get('/ctprogram', authMiddleware, getProgram);
router.get('/ctleadsoriginacion', authMiddleware, getOriginationLead);
router.get('/oripromoter', authMiddleware, getOriginationPromoter);
router.get('/statusorigi', authMiddleware, getOriginationStatus);
router.get('/ctapprovedbuyer', authMiddleware, getApprovedBuyer);
router.get('/ctprospecpriority', authMiddleware, getProspectPriority);
router.get('/ctprojectalive', authMiddleware, getProjectAlive);


module.exports = router;
