const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getMRV,
    setMRV
 } = require('../../controllers/mrv/MRV');


router.get('/getMRV/:id', authMiddleware, getMRV);
router.post('/setMRV', authMiddleware, setMRV);


module.exports = router;