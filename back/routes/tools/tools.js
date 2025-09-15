const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getCapexAccounts, getCapexSubaccounts,setCapexAccounts, setCapexSubaccounts, getOpexAccounts, getOpexSubaccounts, setOpexAccounts, setOpexSubaccounts } = require('../../controllers/tools/tools');

router.get('/getCapexAccounts', authMiddleware, getCapexAccounts);
router.get('/getCapexSubaccounts', authMiddleware, getCapexSubaccounts);

router.get('/getOpexAccounts', authMiddleware, getOpexAccounts);
router.get('/getOpexSubaccounts', authMiddleware, getOpexSubaccounts);

router.post('/setCapexAccounts', authMiddleware, setCapexAccounts);
router.post('/setCapexSubaccounts', authMiddleware, setCapexSubaccounts);

router.post('/setOpexAccounts', authMiddleware, setOpexAccounts);
router.post('/setOpexSubaccounts', authMiddleware, setOpexSubaccounts);

module.exports = router;