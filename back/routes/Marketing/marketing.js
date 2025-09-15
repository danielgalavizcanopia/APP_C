const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middlewares/Middleware')

const { getActivitiesByRPmark, getReportingByActivitymark } = require('../../controllers/MarketingAirTable/marketing');
const { setImportAcivityEventCatalog } = require('../../controllers/MarketingAirTable/airtable');

router.get('/getActivitiesByRPmark/:id/:rp', getActivitiesByRPmark, authMiddleware)
router.get('/getReportingByActivitymark/:id', getReportingByActivitymark, authMiddleware)

router.post('/setImportAcivityEventCatalog', setImportAcivityEventCatalog, authMiddleware)

module.exports = router;    
