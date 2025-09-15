const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getHitosProcess, getCategoriaEvidencia, getTipoEvidencia } = require('../../controllers/bitacora/catalogs-bitacora');

router.get('/getHitosProcess', authMiddleware, getHitosProcess);
router.get('/getCategoriaEvidencia/:id', authMiddleware, getCategoriaEvidencia);
router.get('/getTipoEvidencia/:id', authMiddleware, getTipoEvidencia);

module.exports = router;