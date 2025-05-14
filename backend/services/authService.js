const jwt = require("jsonwebtoken")

const authService = (req, res, next) =>{
    const token = req.header("Authorization")

    if(!token){
        return res.status(401).json({error:"Acceso denegado. Token no proporcionado"})
    }

    try{
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
        req.usuario = decoded;
        next();
    }catch(error){
        return res.status(403).json({error:"El token ha expirado"});
    }
}


module.exports = authService;