const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const { setActivities, getActivities, getMacroProcess } = require('../../controllers/tools/activities');

router.get('/getActivities', authMiddleware, getActivities);
router.post('/setActivities', authMiddleware, setActivities);
router.get('/getMacroProcess', authMiddleware, getMacroProcess);

module.exports = router;

