const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/Middleware')
const { register,
        login,
        getCtPositions,
        setUsers,
        getUsers,
        // generatePassword
     } = require('../controllers/users');
// const { getDataTestAirTable, createDataTestAirTable, updateDataTestAirTable, deleteDataTestAirTable } = require('../controllers/MarketingAirTable/airtable')
// generatePassword
/** AUTH ROUTES */
router.post('/register', register);
router.post('/login', login);
router.post('/setUsers', authMiddleware, setUsers);
router.get('/getUsers', authMiddleware, getUsers);
router.get('/getCtPositions', authMiddleware, getCtPositions);
// router.post('/generatepass', generatePassword);

// /** ENDPOINTS TEST AIRTABLE */
// router.get('/getAirtable/', getDataTestAirTable)
// router.post('/createRecordAirtable/', createDataTestAirTable)
// router.post('/updateDataTestAirTable/', updateDataTestAirTable)
// router.post('/deleteDataTestAirTable/', deleteDataTestAirTable)

module.exports = router;    