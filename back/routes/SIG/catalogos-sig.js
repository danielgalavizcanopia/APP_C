const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();

const {
    getCertificacion,
    getCtRAN,
    getctlead,
    getctstatusvalidnap,

    getversionAA,
    getStatusValidacionAA,

    getResultadopedAP,
    getseccionAA,
    getPoblacionAA,
    getActividadAgropecuaria,
    getEncuestas,
    getSubsidios,
    getPendienteAA,
    getCambioCobertura,
    getResultadopedAA,
} = require('../../controllers/SIG/catalogs-sig');

router.get('/getctCertifi', authMiddleware, getCertificacion);
router.get('/catRan', authMiddleware, getCtRAN);
router.get('/getctlead', authMiddleware, getctlead); // ESTE SE USA PARA LAS 3 SECCIONES
router.get('/getctstatusvalidnap', authMiddleware, getctstatusvalidnap);

/** AREA DE ACTIVIDAD */
router.get('/catversionaa', authMiddleware, getversionAA);
router.get('/validacion', authMiddleware, getStatusValidacionAA);

/** PED */
router.get('/resultAp', authMiddleware, getResultadopedAP);
router.get('/ctseccionAA', authMiddleware, getseccionAA);
router.get('/ctpoblacionAA', authMiddleware, getPoblacionAA);
router.get('/ctActivityAG', authMiddleware, getActividadAgropecuaria);
router.get('/ctEncuestas', authMiddleware, getEncuestas);
router.get('/ctsubSidiosAA', authMiddleware, getSubsidios);
router.get('/ctPendienteAA', authMiddleware, getPendienteAA);
router.get('/ctChangeofCoverage', authMiddleware, getCambioCobertura);
router.get('/ctresultPedAA', authMiddleware, getResultadopedAA);

module.exports = router;
