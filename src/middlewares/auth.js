const jwt = require("jsonwebtoken");

//mw1 - validate token
const validateToken = function (req, res, next) {

    const token = req.headers["x-auth-token"]
    if (!token) return res.send({ status: false, msg: "error: token not sent, mandatory to send token from header" });
    console.log("token validated with middleware-1")
    try {
        const decodeToken = jwt.verify(token, "functionup-radon"); 
        
    } catch (error) {
        return res.send({ status: false, msg: "error: token is invalid" })
    }

    next();
}

// mw2 - validate user
const validateUser = function (req, res, next) {

    const token = req.headers["x-auth-token"]
    const decodeToken = jwt.verify(token, "functionup-radon");
    const loggedInUserId = decodeToken.userId;
    const userToBeModified = req.params.userId;
    console.log("user validated with middleware-2")


    if (loggedInUserId !== userToBeModified) return res.send(`you are not authorised to make changes in this user ${userToBeModified} because you have logged in as this user ${loggedInUserId}`);

    next();
}
module.exports.validateToken = validateToken;
module.exports.validateUser = validateUser;
