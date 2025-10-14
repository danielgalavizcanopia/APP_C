const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const { getSettlementCurrency,
        getPaymentType,
        getDeductionType,
        getPercentageByProject,
        getStatusSettlement,
        getPrePaymentDeductions,
        setPrePaymentDeductions,
        getTypeAdjustments,
        setTypeAdjustment
    } = require('../../controllers/settlement/catalog-settlement');

router.get('/getSettlementCurrency', authMiddleware, getSettlementCurrency);
router.get('/getPaymentType', authMiddleware, getPaymentType);
router.get('/getDeductionType', authMiddleware, getDeductionType);
router.get('/getPercentageByProject/:id', authMiddleware, getPercentageByProject);
router.get('/getStatusSettlement', authMiddleware, getStatusSettlement);
router.get('/getPrePaymentDeductions', authMiddleware, getPrePaymentDeductions);
router.post('/setPrePaymentDeductions', authMiddleware, setPrePaymentDeductions);
router.get('/getTypeAdjustments', authMiddleware, getTypeAdjustments);
router.post('/setTypeAdjustment', authMiddleware, setTypeAdjustment);

module.exports = router;