const { ejecutarVistaTools } = require('../../../queries/executeViews');
const { ejecutarStoredProcedure } = require('../../../queries/projects');
const jwt = require('jsonwebtoken');

function catchUserLogged(req) {
    return new Promise(function (resolve, reject){
        const token = req.header('Authorization').split(" ")[1];
        if(!token){
            resolve({error: "no hay usuario logueado"})
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            resolve({IDUser: decoded.IDUser});
        }
    });
};


function getSOP(req, res){
    return new Promise(async (resolve, reject) => {
        try {
            const resultados = await ejecutarVistaTools('vw_ct_sop',[]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

function setSOP(req, res){
    return new Promise(async (resolve, reject) => {
        let IDUser = await catchUserLogged(req);

        try {
            const resultados = await ejecutarStoredProcedure('sp_setSOP',[
                req.body.p_Idsop,
                req.body.p_ShortDescriptionSOP,
                req.body.p_LargeDescriptionSOP, 
                req.body.p_StatusSOP,
                IDUser.IDUser, 
                req.body.p_Idsop ? IDUser.IDUser : 0]);
            if(resultados.length > 0){
                res.status(201).json({valido: 1, result: resultados[0]});
            } else {
                res.status(500).json({valido: 0, message: "Was an error, please, try again"});
            }
        } catch (error) {
        }
    });
}

module.exports = {
    getSOP,
    setSOP
}