const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
// const {
//     getBenefitsTracker, 
//     generateXLSXBenefitDTracker
// } = require('../../controllers/financialMonitoring/monitorSummary');

const {
    getByActivitiesReport,
    getByActivitiesReportXLSX
} = require('../../controllers/financialMonitoring/ByActivities');

const {
    getByAccountsReport,
    getByAccountsReportXLSX,
} = require('../../controllers/financialMonitoring/ByAccounts');

const {
    getByBenefitDistribution,
    getByBenefitDistributionXLSX
} = require('../../controllers/financialMonitoring/ByBenefitD')

const {
    getProvisionalXlsx
} = require('../../controllers/financialMonitoring/ProvisionalReport')

const {
    getTransactionTracker,
    getTransactionTrackerXLSX,
    getByTransactionByAllReport,
} = require('../../controllers/financialMonitoring/ByTransaction');

const {
    getFullFinancialMonitoringReport,
    getRangeRPByDates
} = require('../../controllers/financialMonitoring/FullFinancialReport');

const {
    getByAccountDetails,
    setReviewActualRequest,
    getActualRequests,
    getHistoryRequests,
    setDeletePedingRequests,
    getTransactionsDetailsByID,
    getHistoryActualRequest,
    setAuthotizationRequest,
    getStatusAuthorizations,
    getConfigUsersAndAccounts,
    getUsersWithAuthorization,
    getAllSubAccounts,
} = require('../../controllers/financialMonitoring/changeRequest/changeRequest');

/** CHANGE ACTUAL RESQUEST */
router.post('/getByAccountDetails', authMiddleware, getByAccountDetails);
router.post('/setReviewActualRequest', authMiddleware, setReviewActualRequest);
router.get('/getActualRequests', authMiddleware, getActualRequests);
router.get('/getHistoryRequests', authMiddleware, getHistoryRequests);
router.get('/getStatusAuthorizations', authMiddleware, getStatusAuthorizations);
router.get('/getUsersWithAuthorization', authMiddleware, getUsersWithAuthorization);
router.get('/getConfigUsersAndAccounts', authMiddleware, getConfigUsersAndAccounts);
router.get('/getTransactionsDetailsByID/:id', authMiddleware, getTransactionsDetailsByID);
router.get('/getHistoryActualRequest/:id', authMiddleware, getHistoryActualRequest);
router.post('/setAuthotizationRequest', authMiddleware, setAuthotizationRequest);
router.post('/setDeletePedingRequests', authMiddleware, setDeletePedingRequests);
router.get('/getAllSubAccounts', authMiddleware, getAllSubAccounts);


/** BY ACTIVITIES CONTROLLERS */
router.get('/getBudgetTrackerByProjectRP/:idprojects/:rpnumber', authMiddleware, getByActivitiesReport);
router.get('/generateXLSXBT/:idprojects/:rpnumber', authMiddleware, getByActivitiesReportXLSX);

/** BY ACCOUNTS CONTROLLERS */
router.get('/getFinancialTracker/:idprojects/:rpnumber', authMiddleware, getByAccountsReport);
router.get('/generateXLSXFT/:idprojects/:rpnumber', authMiddleware, getByAccountsReportXLSX);

/** BY BENEFIT DISTRIBUTION CONTROLLERS */
router.get('/getBenefitsTracker/:idprojects/:rpnumber', authMiddleware, getByBenefitDistribution);
router.get('/generateXLSXBenefitDTracker/:idprojects/:rpnumber', authMiddleware, getByBenefitDistributionXLSX);

/** BY TRANSACTION CONTROLLERS */
router.get('/getTransactionTracker/:idprojects/:rpnumber', authMiddleware, getTransactionTracker);
router.get('/getTransactionTrackerXLSX/:idprojects/:rpnumber', authMiddleware, getTransactionTrackerXLSX);
router.get('/getByTransactionByAllReport', authMiddleware, getByTransactionByAllReport);
/** SHAREPOINT ENDPOINTS */
router.get('/getProvisionalXlsx/:folioProject/:idProject/:rpnumbers', authMiddleware, getProvisionalXlsx);

/** ENDPOINT FULL FINANCIAL MONITOR REPORT */
router.get('/getFullFinancialMonitoringReport/:idprojects/:rpnumber', authMiddleware, getFullFinancialMonitoringReport);
router.get('/getRangeRPByDates/:idprojects/:rpnumber', authMiddleware, getRangeRPByDates);


module.exports = router;