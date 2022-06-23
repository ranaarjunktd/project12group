const jwt = require('jsonwebtoken');
const authorModel = require('../models/authorModel.js');
const blogModel = require('../models/blogModel.js');

//authentication
const checkLogin = function(req, res, next){
    try {
        console.log("reached mw1");
        const token = req.headers["x-api-key"];    //how to auto insert separate secret key for each login?
        if(!token){return res.status(400).send({status:false, error: "token not sent", msg: "token is mandatory"})} //validation1
        const decode = jwt.verify(token, "topScerect");
        next();    
    } catch (error) {
        return res.status(500).send({status:false, error: error.name, msg: error.message}) //if err.name is decode=>
    }
}

//authorisation
const checkOwner = async function(req, res, next){
    try {
        console.log("reached mw2");
        const token = req.headers["x-api-key"]; 
        const blogId = req.params.blogId;
        if(!blogId){return res.status(200).send({status:false, msg: "enter blog Id"})}; //validation1
        if(blogId.split("").length !==24){return res.status(400).send({status:false, msg: "enter a valid id"})} //validation2

        const blog = await blogModel.findById(blogId);
        const blogOwnerId = blog.authorId.toString();
        
        const decode = jwt.verify(token, "topScerect");
        const loggedInUser = decode.authorId;
        // console.log(loggedInUser);console.log(blogOwnerId); //printing only for explanation

        if(loggedInUser === blogOwnerId){
            next(); //u r authorized to make changes in this blog
        }else{
            return res.status(403).send({status:false, msg: "you are not authorised to make changes in this blog"}) //validation3
        }
    } catch (error) {
        return res.status(500).send({status:false, error: error.name, msg: error.message})
    }
}

const authforQueryDelete = async function(req, res, next){
    try {
        console.log("reached mw3");
        const token = req.headers["x-api-key"];
        const decode = jwt.verify(token, "topScerect");
        const loggedInUserId = decode.authorId;

        let authorId = req.query.authorId;
        if(authorId && authorId.split("").length !==24){return res.status(400).send({status:false, msg: "enter a valid id"})} //validation1
        if(authorId && (authorId !== loggedInUserId)){return res.status(400).send({status:false, msg: "you are not authorised to delete blogs of different author"})} //val2
        if(!authorId){authorId = loggedInUserId}; //validation3
        req.query.authorId = authorId; //updating authorId qeury by loggedInUserId value
        next();
    } catch (error) {
        return res.status(500).send({status:false, error: error.name, msg: error.message})
    }
}
module.exports.checkLogin = checkLogin;
module.exports.checkOwner = checkOwner;
module.exports.authForQueryDelete = authforQueryDelete;