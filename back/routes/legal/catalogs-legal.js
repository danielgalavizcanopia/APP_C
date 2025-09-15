const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getLeadLegal, getDDSattus, getMEKYCStatus, getProyectosLegal } = require('../../controllers/legal/catalogs-legal');

router.get('/getLeadLegal', authMiddleware, getLeadLegal);
router.get('/getDDSattus', authMiddleware, getDDSattus);
router.get('/getMEKYCStatus', authMiddleware, getMEKYCStatus);
router.get('/getProyectosLegal', authMiddleware, getProyectosLegal);

module.exports = router;