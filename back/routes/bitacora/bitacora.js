const express = require("express");
const authMiddleware = require('../../middlewares/Middleware')
const router = express.Router();
const { getBitacoraById, 
        getBitacoraByProject, 
        setBitacora, 
        viewPDFFiles, 
        getEvidenciasByBitacora, 
        updateEvidencia,
        setValidateEvidence,
        getLinkEvidenciasByBitacora, 
        getBitacoraFiltered, 
        getBitacoraXLSX, 
        getBitacoraDOCX, 
        getBitacoraWithEvidences
     } = require('../../controllers/bitacora/bitacora');
const { uploadBitacora } = require('../../config/config-files')


router.post('/setBitacora', authMiddleware, uploadBitacora.single('file'), setBitacora);
router.post('/setValidateEvidence', authMiddleware, setValidateEvidence);
router.get('/getBitacoraById/:id', authMiddleware, getBitacoraById);
router.get('/getBitacoraByProject/:id', authMiddleware, getBitacoraByProject);
router.get('/getEvidenciasByBitacora/:id', authMiddleware, getEvidenciasByBitacora);
router.post('/updateEvidencia', authMiddleware, uploadBitacora.single('file'), updateEvidencia);
router.get('/getDocumentBitacora/:filename', viewPDFFiles);
router.post('/getLinkEvidenciasByBitacora', authMiddleware, getLinkEvidenciasByBitacora);
router.post('/getBitacoraFiltered', authMiddleware, getBitacoraFiltered);
router.get('/getBitacoraXLSX', authMiddleware, getBitacoraXLSX);
router.get('/getBitacoraDOCX', authMiddleware, getBitacoraDOCX);
router.get('/getBitacoraWithEvidences', authMiddleware, getBitacoraWithEvidences);




module.exports = router;