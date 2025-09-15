const express = require("express");
const authMiddleware = require('../../../middlewares/Middleware')
const router = express.Router();
const { getHitoProcess, setHitoProcess, getCategories, setCategories, getEvidences, setEvidences, setCatRelationship } = require('../../../controllers/tools/bitacoraAdminCatalogs/bitacoraAdminCt');

router.get('/getHitoProcess', authMiddleware, getHitoProcess);
router.post('/setHitoProcess', authMiddleware, setHitoProcess);

router.get('/getCategories', authMiddleware, getCategories);
router.post('/setCategories', authMiddleware, setCategories);

router.get('/getEvidences', authMiddleware, getEvidences);
router.post('/setEvidences', authMiddleware, setEvidences);

router.post('/setCatRelationship', authMiddleware, setCatRelationship);

module.exports = router;

