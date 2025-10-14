const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const {
    Getincidentimpact,
    getInvolvedSIL,
    getIncidenceType,
    getLogByIdProject,
    getCanopiaUsers,
    getStatusIncidence,
    getUserProManager
} = require('../../controllers/incidences/catalogs-incidences');


router.get('/getincidentimpact', authMiddleware, Getincidentimpact);
router.get('/getInvolvedSIL', authMiddleware, getInvolvedSIL);
router.get('/getIncidenceType', authMiddleware, getIncidenceType);
router.get('/getCanopiaUsers', authMiddleware, getCanopiaUsers);
router.get('/getLogByIdProject/:id', authMiddleware, getLogByIdProject);
router.get('/getStatusIncidence', authMiddleware, getStatusIncidence);
router.get('/getUserProManager', authMiddleware, getUserProManager);

module.exports = router;