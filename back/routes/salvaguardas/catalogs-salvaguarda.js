const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const {
    getbiodiversity,
    geths,
    getHumanRights,
    getIndigenousPeople,
    getLeadSafeGuards,
    getNegativeHS,
    getProjects,
    getSafeguardNHapproach,
    getShareHoldersEngagement,
    getSocialCommunityNH,
    getStatusSafeguard,
 } = require('../../controllers/salvaguardas/catalogs-salvaguarda');


 router.get('/getbiodiversity', authMiddleware, getbiodiversity);
 router.get('/geths', authMiddleware, geths);
 router.get('/getHumanRights', authMiddleware, getHumanRights);
 router.get('/getIndigenousPeople', authMiddleware, getIndigenousPeople);
 router.get('/getLeadSafeGuards', authMiddleware, getLeadSafeGuards);
 router.get('/getNegativeHS', authMiddleware, getNegativeHS);
 router.get('/getProjects', authMiddleware, getProjects);
 router.get('/getSafeguardNHapproach', authMiddleware, getSafeguardNHapproach);
 router.get('/getShareHoldersEngagement', authMiddleware, getShareHoldersEngagement);
 router.get('/getSocialCommunityNH', authMiddleware, getSocialCommunityNH);
 router.get('/getStatusSafeguard', authMiddleware, getStatusSafeguard);


 module.exports = router;