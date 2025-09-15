const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { setActivitiesData,
        getActivitiesData, 
        setValidaciones, 
        setUsuariosName, 
        setCuantitativos, 
        setPlanAnnual, 
        deleteIndicador, 
        deleteReporting, 
        getPlanAnualByProject, 
        getActividadesByPlanAnual,
        getPlanAnualById, 
        getIndicadoresCuantitativosByActividad, 
        getOdsByActividad, 
        getReporteoByActividad, 
        getPlanAnualHistorico, 
        getActividadesByPlanAnualHistorico, 
        getIndicadoresCuantitativosByActividadHistorico,
        getReportingByActividadHistorico, 
        getActividadesWithoutPlanAnual
 } = require('../../controllers/implementation/implementationPlan');

 const {
        generateDocxAnnualPlan, 
        generateXLSXAnnualPlan,
        generateXLSXDraft,
 } = require('../../controllers/implementation/files-implementation');
const { uploadImplementation } = require('../../config/config-files');

router.post('/setActivitiesData', authMiddleware, uploadImplementation.single('file'), setActivitiesData);
router.post('/deleteIndicators', authMiddleware, deleteIndicador);
router.post('/deleteReporting', authMiddleware, deleteReporting);
router.get('/getActivitiesData/:id', authMiddleware, getActivitiesData);
router.post('/setValidaciones', authMiddleware, setValidaciones);
router.post('/setUsuariosName', authMiddleware, setUsuariosName);
router.post('/setCuantitativos', authMiddleware, setCuantitativos);
router.post('/setPlanAnnual', authMiddleware, setPlanAnnual);
router.get('/getPlanAnualByProject/:id', authMiddleware, getPlanAnualByProject);
router.get('/getActividadesByPlanAnual/:id', authMiddleware, getActividadesByPlanAnual);
router.get('/getActividadesWithoutPlanAnual/:id/:idrpnumber/:idplan', authMiddleware, getActividadesWithoutPlanAnual);
router.get('/getPlanAnualById/:id', authMiddleware, getPlanAnualById);
router.get('/getIndicadoresCuantitativosByActividad/:id', authMiddleware, getIndicadoresCuantitativosByActividad);
router.get('/getOdsByActividad/:id', authMiddleware, getOdsByActividad);
router.get('/getReporteoByActividad/:id', authMiddleware, getReporteoByActividad);
router.get('/getPlanAnualHistorico/:id', authMiddleware, getPlanAnualHistorico);
router.get('/getActividadesByPlanAnualHistorico/:id', authMiddleware, getActividadesByPlanAnualHistorico);
router.get('/getIndicadoresCuantitativosByActividadHistorico/:id', authMiddleware, getIndicadoresCuantitativosByActividadHistorico);
router.get('/getReportingByActividadHistorico/:id', authMiddleware, getReportingByActividadHistorico);


router.get('/generateDocxAnnualPlan/:id', authMiddleware, generateDocxAnnualPlan);
router.get('/generateXLSXAnnualPlan/:id', generateXLSXAnnualPlan);
router.get('/generateXLSXDraft/:id/:rp', generateXLSXDraft);

module.exports = router;
