const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const {
    getMrvLead,
    getleakeage,
    getmrvrequirements,
    getpermanence,
    getstatusmrv
 } = require('../../controllers/mrv/catalogs-mrv');


 router.get('/getMrvLead', authMiddleware, getMrvLead);
 router.get('/getleakeage', authMiddleware, getleakeage);
 router.get('/getmrvrequirements', authMiddleware, getmrvrequirements);
 router.get('/getpermanence', authMiddleware, getpermanence);
 router.get('/getstatusmrv', authMiddleware, getstatusmrv);

 module.exports = router;