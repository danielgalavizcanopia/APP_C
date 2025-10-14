const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const {
    setLockSummaryCost,
    getLockSummaryCost,
} = require('../../controllers/summaryCost/summaryLockCost');

const { 
    getSummaryCostByProject,
} = require('../../controllers/summaryCost/summaryCost');

const { 
    getAnnualCostByProject,
    setAnnualCostByProject
} = require('../../controllers/summaryCost/annualCost');

const { 
    getUpfrontCostDeductionByProject,
    setUpfrontCostDeductionByProject
 } = require('../../controllers/summaryCost/upfrontCostDeduction');

const { 
    getAnnualCostDeductionsByProject,
    setAnnualCostDeductionsByProject
} = require('../../controllers/summaryCost/annualCostDeductions');

const {
    getUpfrontCostByProject,
    setUpfrontCostByProject
} = require('../../controllers/summaryCost/upfrontCost');


/** LOCK SUMMARY COST */
router.get('/getLockSummaryCost', authMiddleware, getLockSummaryCost);
router.post('/setLockSummaryCost', authMiddleware, setLockSummaryCost);

/** SUMMARY COST */
router.get('/getSummaryCostByProject/:id', authMiddleware, getSummaryCostByProject);

/** ANNUAL COST */
router.get('/getAnnualCostByProject/:id', authMiddleware, getAnnualCostByProject);
router.post('/setAnnualCostByProject', authMiddleware, setAnnualCostByProject);

/** UPFRONT COST DEDUCTIONS */
router.get('/getUpfrontCostDeductionByProject/:id', authMiddleware, getUpfrontCostDeductionByProject);
router.post('/setUpfrontCostDeductionByProject', authMiddleware, setUpfrontCostDeductionByProject);

/** ANNUAL COST DEDUCTIONS */
router.get('/getAnnualCostDeductionsByProject/:id', authMiddleware, getAnnualCostDeductionsByProject);
router.post('/setAnnualCostDeductionsByProject', authMiddleware, setAnnualCostDeductionsByProject);

/** UPFRONT COST */
router.get('/getUpfrontCostByProject/:id', authMiddleware, getUpfrontCostByProject);
router.post('/setUpfrontCostByProject', authMiddleware, setUpfrontCostByProject);


module.exports = router;