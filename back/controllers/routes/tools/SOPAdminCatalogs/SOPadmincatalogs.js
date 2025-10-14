const express = require("express");
const authMiddleware = require('../../../middlewares/Middleware')
const router = express.Router();
const { getSOP, setSOP } = require('../../../controllers/tools/SOPAdminCatalogs/SOPadmincatalogs');

router.get('/getSOP', authMiddleware, getSOP);
router.post('/setSOP', authMiddleware, setSOP);

module.exports = router;
