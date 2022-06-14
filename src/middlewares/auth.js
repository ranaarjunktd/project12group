const jwt = require("jsonwebtoken");

const validateToken = function(req, res, next){
    
    const token = req.headers["x-auth-token"] 

    if(!token) return res.send({status: false, msg:"error: token not sent, mandatory to send token from header"});
    console.log("token validating with middleware")
    try{
        const decodeToken = jwt.verify(token, "functionup-radon");
    }catch(error){
        return res.send({ status: false, msg:"error: token is invalid"})
    }
    
    next();
}

module.exports.validateToken =validateToken;