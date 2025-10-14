const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
    getActivities,
    insertActivityArea,
 } = require('../../controllers/SIG/activity-area');


router.get('/getactivitiesbyid/:id', authMiddleware, getActivities);
router.post('/setactivities', authMiddleware, insertActivityArea);


module.exports = router;
