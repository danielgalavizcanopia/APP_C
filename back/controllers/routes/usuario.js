'use strict'
const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario');
const auth = require('../midlewares/auth')


/***************************RUTAS BASE GET,GETBYID,UPDATE,SET********************************** */
router.get('/get',Get);
router.get('/getbyid/:usuario_id',auth.isAuth,GetbyID);
router.post('/add',Add);
router.post('/update',Update) 
/********************************************************************************************* */
router.get('/get-usuario-login/:usuario_pw/:usuario_email', GetUsuarioLogin);


/*******************************Funciones BASE GET GETBYID, UPDATE ,SET*********************** */
function Get(req,res){
    usuarioCtrl.Get()
    .then(function (result){
        res.json(result);
    })
}

function GetbyID(req,res){
    let usuario_id = req.params.usuario_id;
    usuarioCtrl.GetbyID({usuario_id : usuario_id})
    .then(function (result){
        res.json(result);
    })
}

function Add(req,res){
    let datos = req.body;
    usuarioCtrl.Add(datos)
    .then(function (result){
        res.json(result);
    })
}

function Update(req,res){
    let datos = req.body;
    usuarioCtrl.Update(datos)
    .then(function (result){
        res.json(result);
    })
}

/********************************************************************************************* */

function GetUsuarioLogin(req, res) {
    let usuario_pw = req.params.usuario_pw;
    let usuario_email = req.params.usuario_email;
    usuarioCtrl.GetUsuarioLogin({ usuario_pw: usuario_pw, usuario_email: usuario_email })
        .then(function (result) {
            res.json(result);
        })

}
module.exports = router;
