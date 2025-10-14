const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getDesarrolloByProject, setDesarrolloAndCRT } = require('../../controllers/desarrollo/desarrollo');


router.get('/getDesarrolloByProject/:id', authMiddleware, getDesarrolloByProject);
router.post('/setDesarrolloAndCRT', authMiddleware, setDesarrolloAndCRT);


module.exports = router;