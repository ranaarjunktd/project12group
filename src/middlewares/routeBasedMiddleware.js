const jwt = require('jsonwebtoken');
const blogModel = require('../models/blogModel.js');
const mongoose = require('mongoose');


//authentication
const checkLogin = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];    //how to auto insert separate secret key for each login?
        if (!token) { return res.status(400).send({ status: false, error: "token not sent", msg: "token is mandatory" }) } //validation1
        const decode = jwt.verify(token, "topScerect");
        next();
    } catch (error) {
        return res.status(500).send({ status: false, error: error.name, msg: error.message }) 
    }
}

//authorisation
const checkOwner = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        const blogId = req.params.blogId;
        // if (!blogId) { return res.status(200).send({ status: false, msg: "enter blog Id" }) }; //validation1
        if (!mongoose.Types.ObjectId.isValid(blogId)) { return res.status(400).send({ status: false, msg: "enter a valid id" }) } //validation1(also handles !Id)

        const blog = await blogModel.findById(blogId);
        if(!blog){return res.status(404).send({status:false, error: "no resource found"})} //val2
        const blogOwnerId = blog.authorId.toString();

        const decode = jwt.verify(token, "topScerect");
        const loggedInUser = decode.authorId;

        if (loggedInUser === blogOwnerId) {
            next(); //u r authorized to make changes in this blog
        } else {
            return res.status(403).send({ status: false, msg: "you are not authorised to make changes in this blog" }) //validation3
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, error: error.name, msg: error.message })
    }
}

//authorisation of delete by Query
const authforQueryDelete = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        const decode = jwt.verify(token, "topScerect");
        const loggedInUserId = decode.authorId;

        let authorId = req.query.authorId;
        if (!mongoose.Types.ObjectId.isValid(authorId)) { return res.status(400).send({ status: false, msg: "enter a valid id" }) } //validation1
        if (authorId && (authorId !== loggedInUserId)) { return res.status(400).send({ status: false, msg: "you are not authorised to delete blogs of different author" }) } //val2
        if (!authorId) { authorId = loggedInUserId }; //validation3
        req.query.authorId = authorId; //updating authorId qeury by loggedInUserId value
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, error: error.name, msg: error.message })
    }
}




module.exports.checkLogin = checkLogin;
module.exports.checkOwner = checkOwner;
module.exports.authForQueryDelete = authforQueryDelete;


