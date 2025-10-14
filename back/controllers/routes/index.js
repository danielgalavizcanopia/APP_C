const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/Middleware')

const { handleFileUpload, upload, testView } = require('../controllers/files');

//Raiz
router.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo usando rutas!"
        }
    );
})

router.get('/testview/:id', authMiddleware, testView)
router.post('/upload', upload.single('file'), handleFileUpload);
 
module.exports = router;