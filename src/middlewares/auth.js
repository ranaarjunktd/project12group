const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//mw1 - validate token
const validateToken = function (req, res, next) {
    try {
        console.log("token validated with middleware-1") //simply writing, not mandatory this line of code
        const token = req.headers["x-auth-token"]   
        if (!token) return res.status(401).send({ status: false, msg: "error: token not sent, mandatory to send token from header, authentication missing" });

        const decodeToken = jwt.verify(token, "functionup-radon");
        next();

    } catch (error) {
        return res.status(500).send({ status: false, msg1: "error: token is invalid", msg2: error.message })
    }
 
}

// mw2 - validate user
const validateUser = async function (req, res, next) {
    try {
        console.log("user validated with middleware-2") //simply writing, not mandatory this line of code
        const token = req.headers["x-auth-token"]
        const decodeToken = jwt.verify(token, "functionup-radon");

        let userId = req.params.userId;
        let userDetails = await userModel.findById(userId);
        if (!userDetails) return res.status(400).send({ status: false, msg: "No such user exists" });

        const loggedInUserId = decodeToken.userId;
        const userToBeModified = req.params.userId;
        

        if (loggedInUserId !== userToBeModified) return res.status(401).send({ status: false, msg: `you are not authorised to make changes in this user ${userToBeModified} because you have logged in as this user ${loggedInUserId}` });
        next();

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports.validateToken = validateToken;
module.exports.validateUser = validateUser;
