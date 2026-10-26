// Checkeamos si el usuario esta logueado y para eso vamos  a corroborar que tenga un token valido
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

function jwtVerify(req, res, next) {

    
    // const token = req.headers.authorization.split('')[1];
    const token = req.headers.authorization;


    // Checkeamos si nos enviaron un token, de no ser asi retornamos un 401: unauthorized
    if(!token) {
        return res.status(401).send({
            ok : false,
            message: "El token es requerido"
        })
    }

    jwt.verify(token, SECRET, (error, payload) => {
        if(error) {
            return res.status(401). send({
                ok: false,
                message: "Token vencido o invalido"
            });
        };

        req.user = payload;

        next();
    })
}




module.exports= jwtVerify;