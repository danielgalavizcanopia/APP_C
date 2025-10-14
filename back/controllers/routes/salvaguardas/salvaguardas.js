const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getSalvaguardas,
    setSalvaguardas
 } = require('../../controllers/salvaguardas/salvaguardas');


router.get('/getSalvaguardas/:id', authMiddleware, getSalvaguardas);
router.post('/setSalvaguardas', authMiddleware, setSalvaguardas);


module.exports = router;