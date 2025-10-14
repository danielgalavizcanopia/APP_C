const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { 
        getSOPs, 
        getCoordinadores, 
        getejecutorCampo, 
        getevaluador, 
        getseguimiento, 
        getsupervisores, 
        getStatusValidacion, 
        getIndicadoresCuantitativos, 
        getIndicadoresCuantitativosByKPI, 
        getCapexSubAccounts, 
        getOpexSubAccounts, 
        getOds, 
        getCtActivities,
        getRelatedGoals,
        getStatusAnnualPlan,
        getMainManagers
        } = require('../../controllers/implementation/catalogs-implementationPlan');

router.get('/getSOPs', authMiddleware, getSOPs);
router.get('/getCoordinadores', authMiddleware, getCoordinadores);
router.get('/getejecutorCampo', authMiddleware, getejecutorCampo);
router.get('/getevaluador', authMiddleware, getevaluador);
router.get('/getseguimiento', authMiddleware, getseguimiento);
router.get('/getsupervisores', authMiddleware, getsupervisores);
router.get('/getStatusValidacion', authMiddleware, getStatusValidacion);
router.get('/getIndicadoresCuantitativos', authMiddleware, getIndicadoresCuantitativos);
router.get('/getIndicadoresCuantitativosByKPI', authMiddleware, getIndicadoresCuantitativosByKPI);
router.get('/getCapexSubAccounts', authMiddleware, getCapexSubAccounts);
router.get('/getOpexSubAccounts', authMiddleware, getOpexSubAccounts);

router.get('/getOds', authMiddleware, getOds);
router.get('/getCtActivities', authMiddleware, getCtActivities);
router.get('/getRelatedGoals', authMiddleware, getRelatedGoals);
router.get('/getStatusAnnualPlan', authMiddleware, getStatusAnnualPlan);
router.get('/getManagers', authMiddleware, getMainManagers);

module.exports = router;