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
    getTransactionTrackerXLSX
} = require('../../controllers/financialMonitoring/ByTransaction');

const {
    getFullFinancialMonitoringReport
} = require('../../controllers/financialMonitoring/FullFinancialReport');

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

/** SHAREPOINT ENDPOINTS */
router.get('/getProvisionalXlsx/:folioProject/:idProject/:rpnumbers', authMiddleware, getProvisionalXlsx);

/** ENDPOINT FULL FINANCIAL MONITOR REPORT */
router.get('/getFullFinancialMonitoringReport/:idprojects/:rpnumber', authMiddleware, getFullFinancialMonitoringReport);

/*
    router.get('/getBearerToken', authMiddleware, getBearerToken);
    router.get('/getBudgetTrackerSharepoint', authMiddleware, getBudgetTrackerSharepoint);
*/
module.exports = router;