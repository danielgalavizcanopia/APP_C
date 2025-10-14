const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getviewAreaPHist,
    getviewAreaPById,
    setAreaProyecto,
 } = require('../../controllers/SIG/area-proyecto');


 router.get('/viewbyid/:id', authMiddleware, getviewAreaPById);
 router.post('/setproyectarea', authMiddleware, setAreaProyecto);
router.get('/viewbyidhist/:id', authMiddleware, getviewAreaPHist);


module.exports = router;
