const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { sendmail } = require('../../controllers/emails/email');
const { sendmailIncidence } = require('../../controllers/emails/EmailIncidences');

router.post('/sndEmail', authMiddleware, sendmail);
router.post('/sndEmailIncidence', authMiddleware, sendmailIncidence);


module.exports = router;
