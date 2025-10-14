const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getprogramme, 
        getgroupreporting, 
        getregistrationroute, 
        getverifier, 
        getRPnumber
    } = require('../../controllers/reportingPeriods/catalogs-reportingPeriods');

router.get('/getprogramme', authMiddleware, getprogramme);
router.get('/getGroupReporting', authMiddleware, getgroupreporting);
router.get('/getRegistrationRoute', authMiddleware, getregistrationroute);
router.get('/getverifier', authMiddleware, getverifier);
router.get('/getRPnumber', authMiddleware, getRPnumber);
module.exports = router;