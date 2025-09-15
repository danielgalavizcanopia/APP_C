const express = require('express');
const router = express.Router();
const usuarioConsolaCtrl = require('../controllers/usuario.consola.controller');
const auth = require('../midlewares/auth');
router.post('/IniciarSesion', iniciarSesion);



function iniciarSesion(req, res) {
    let datos = req.body;
    usuarioConsolaCtrl.iniciarSesion(datos)
        .then(function (result) {
            res.json(result);
        })
}


module.exports = router;