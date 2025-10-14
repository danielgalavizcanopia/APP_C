const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getpedArea,
    insertPEDarea,
 } = require('../../controllers/SIG/ped-area');


router.get('/getped/:id', authMiddleware, getpedArea);
router.post('/postped', authMiddleware, insertPEDarea);


module.exports = router;
