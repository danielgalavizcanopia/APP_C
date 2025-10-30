const express = require("express");
const authMiddleware = require('../../../middlewares/Middleware')
const { getSubAccountsCatalog, getManagersBySubaccount, getCatalogManagers } = require('../../../controllers/tools/evaluators-subaccounts/evaluators-subaccounts');
const router = express.Router();

router.get('/getSubAccountsCatalog', authMiddleware, getSubAccountsCatalog);
router.get('/getManagersBySubaccount/:type/:subaccount', authMiddleware, getManagersBySubaccount);
router.get('/getCatalogManagers', authMiddleware, getCatalogManagers);

module.exports = router;