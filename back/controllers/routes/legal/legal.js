const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getLegal,
    setLegal
 } = require('../../controllers/legal/legal');


router.get('/getLegal/:id', authMiddleware, getLegal);
router.post('/setLegal', authMiddleware, setLegal);


module.exports = router;
