const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const { 
    setSettlement,
    getSettlement,
    getSettlementDetails,
    getSettlementDeductions,
    getRPCountByProject,
    setStatusSettlement,
    getTotalApprovedByAssembly,
    setDeleteSettlement,
    getSettlementXLSX
 } = require('../../controllers/settlement/settlement');

router.post('/setSettlement', authMiddleware, setSettlement);
router.get('/getSettlement/:id/:idrpnumber', authMiddleware, getSettlement);
router.get('/getSettlementDetails/:id/:idrpnumber', authMiddleware, getSettlementDetails);
router.get('/getSettlementDeductions/:id/:idrpnumber', authMiddleware, getSettlementDeductions);
router.get('/getRPCountByProject/:id', authMiddleware, getRPCountByProject);
router.post('/setStatusSettlement', authMiddleware, setStatusSettlement);
router.get('/getTotalApprovedByAssembly/:id/:idrpnumber', authMiddleware, getTotalApprovedByAssembly);
router.post('/setDeleteSettlement', authMiddleware, setDeleteSettlement);
router.get('/getSettlementXLSX/:id/:idrpnumber', authMiddleware, getSettlementXLSX);

module.exports = router;