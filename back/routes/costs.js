const express = require("express");
const authMiddleware = require('../middlewares/Middleware')
const router = express.Router();
const { 
    getCarbonEquivalentCertificates,
    getUpfrontCostsUSD,
    getUpFrontCostDeductionUSD,
    getAnnualOMCostsDeductionUSD,
    getAnnualOMCosts,
    getAppendixERPAByProyect,
    getSummaryCostbyProyecto,
    setApendicesERPActrl,
    setUpfrontCostsUsd,
    setUCD,
    setAOMCD,
    setAnnualomCTS,

    /**nuevos endpoint */
    getAnnualCosts,
    setAnnualCosts,
 } = require('../controllers/costs');


router.get('/getCarbonEquivalentCertificates/:id', authMiddleware, getCarbonEquivalentCertificates);
router.get('/getUpfrontCostsUSD/:id', authMiddleware, getUpfrontCostsUSD);
router.get('/getUpFrontCostDeductionUSD/:id', authMiddleware, getUpFrontCostDeductionUSD);
router.get('/getAnnualOMCostsDeductionUSD/:id', authMiddleware, getAnnualOMCostsDeductionUSD);
router.get('/getAnnualOMCosts/:id', authMiddleware, getAnnualOMCosts);
router.get('/getAppendixERPAByProyect/:id', authMiddleware, getAppendixERPAByProyect);
router.post('/setApendicesERPActrl', authMiddleware, setApendicesERPActrl);
router.post('/setUpfrontCostsUsd', authMiddleware, setUpfrontCostsUsd);
router.post('/setUCD', authMiddleware, setUCD);
router.post('/setAOMCD', authMiddleware, setAOMCD);
router.post('/setAnnualomCTS', authMiddleware, setAnnualomCTS);
router.get('/getSummaryCostbyProyecto/:id', authMiddleware, getSummaryCostbyProyecto);


router.get('/getAnnualCosts/:id', authMiddleware, getAnnualCosts);
router.post('/setAnnualCosts', authMiddleware, setAnnualCosts);



module.exports = router;
