const express = require("express");
const authMiddleware = require('../middlewares/Middleware')
const router = express.Router();
const { getCEstados, getMunicipalitiesByEstado, getNucleoAgrarioByMunicipality, getCAggregation } = require('../controllers/catalogs');


router.get('/get_estados', authMiddleware, getCEstados);
router.get('/municipalities/:id', authMiddleware, getMunicipalitiesByEstado);
router.get('/agrario/:id', authMiddleware, getNucleoAgrarioByMunicipality);
router.get('/getaggregation', authMiddleware, getCAggregation);

module.exports = router;