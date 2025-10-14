const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getOrigination,
    insertOrigination,
    updateOrigination
 } = require('../../controllers/originacion/originacion');


router.get('/originationbyid/:id', authMiddleware, getOrigination);
router.post('/postorigination', authMiddleware, insertOrigination);
router.put('/puttorigination/:id', authMiddleware, updateOrigination);


module.exports = router;
