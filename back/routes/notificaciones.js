const express = require("express");
const authMiddleware = require('../middlewares/Middleware')
const router = express.Router();
const { ctNotify, ctNotifyAllStatus } = require('../controllers/notificaciones');


router.get('/ctNotify', authMiddleware, ctNotify);
router.get('/NotifyByAllstatus', authMiddleware, ctNotifyAllStatus);

module.exports = router;