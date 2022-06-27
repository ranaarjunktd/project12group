const jwt = require('jsonwebtoken');
const { find } = require('../models/authorModel.js');
const authorModel = require('../models/authorModel.js');
const blogModel = require('../models/blogModel.js');
const mongoose = require('mongoose');


//useful functions

//validating name by regex
function isName(x){
    const regEx = /^\s*(?=[A-Z])[\w\.\s]{2,64}\s*$/   //It will handle all undefined, null, only numbersNaming, dot, space allowed in between
    const result = regEx.test(x)
    return result;
}

//to validate title
function isTitle(x) {  
    if(x){x = x.trim()}; //trimming of the title before test
    if (x !== "Mr" && x !== "Mrs" && x !== "Miss") { return false };
    return true
}

//to validate password
function isPassword(x) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,20}$/ //for password space not allowed, also handles !password
    return re.test(x);
}

//to validate email
function isEmail(x) {
    if (!x) { return false };
    if (x.length > 320) { return false }; //64before@ and 255 after domain=>320
    const at = x.split("@");
    if(at[0].length >64 ){return false};
    if(at[1].length>255){return false};

    const regEx = /^\s*[a-zA-Z0-9]+([\.\-\_][a-zA-Z0-9]+)*@[a-z]+\.[a-z]{2,3}\s*$/;
    return regEx.test(x);

}


//======================================================functions for Blog validations=============================================================
function isBody(x){
    if(!x){return false}
    if(x.trim().length === 0 || x.trim().length <2){return false}
    const regEx = /^\s*[0-9!@#$%^&*\.\-\_\s]{1,}\s*$/
    if(regEx.test(x)){return false};
    return true;
}

function isArrString(x){
    if(!x){return false};   //check for presence
    if(!Array.isArray(x)){return false};
    if(x.length === 0){return false};
    for(let i=0; i<x.length; i++){
        if(typeof x[i] !== "string"){return false};
        if(x[i].trim().length !== x[i].length){return false};
    }
    return true;
}


//Middleware for validation of data before creating auhtor
const validateAuthor = async function (req, res, next) {
    try {
        const details = req.body;
        if(Object.keys(details).length === 0){return res.status(400).send({status:false, error : "can't create author without any key-values"})}
        if (!isName(details.firstName)) { 
            return res.status(400).send({ status: false, msg: "firstName is mandatory and can be alphnumeric with atleast 1st letter as uppercase, special chraracters not allowed except dot(.)" }) 
        };
        details.firstName = details.firstName.trim();

        if (!isName(details.lastName)) { 
            return res.status(400).send({ status: false, msg: "lastName is mandatory and can be alphnumeric with atleast 1st letter as uppercase, special chraracters not allowed except dot(.)" }) 
        };
        details.lastName = details.lastName.trim();

        if (!isTitle(details.title)) { 
            return res.status(400).send({ status: false, msg: "title is mandatory and must be from:\"Mr\", \"Mrs\", \"Miss\"" }) 
        };
        details.title = details.title.trim();

        if (!isEmail(details.email)) { //not true,
            return res.status(400).send({ status: false, msg: "email is mandatory and must be appropriate such that : max length of local part = 255, max length of domain part = 255, total length <=320 and must contain 1 @" }) 
        };
        details.email = details.email.trim();
        
        const documents = await authorModel.findOne({email:req.body.email}); //checking uniqueness of email;
        if (documents) {return res.status(400).send({ status: false, msg: "this email is already in use" })};

        if (!isPassword(details.password)) { 
            return res.status(400).send({ status: false, msg: "password is mandatory and must contains atleast 1(!@#$%^&*), 1digit, 1 upper & 1smaller case" }) 
        };

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, error: error.name, msg: error.message });
    }
}

// validating blog details coming for creating blog
const validateBlog = async function (req, res, next) {
    try {
        const details = req.body;
        if(Object.keys(details).length === 0){return res.status(400).send({status:false, error : "can't create blog without any key-values"})}

        if (!isName(details.title)) { return res.status(400).send({ status: false, message: "title is mandatory and can be alphnumeric with atleast 1st letter as uppercase, special chraracters not allowed except dot(.)" }) };
        details.title = details.title.trim();   //updating trimmed value of title in request body

        if (!isBody(details.body)) { return res.status(400).send({ status: false, msg: "body is mandatory and must contains alphabets" }) };
       
        if (!mongoose.Types.ObjectId.isValid(details.authorId)) { return res.status(400).send({ status: false, msg: "author id is mandatory and make sure it must be a valid mongoDB Id" }) };  //also validates for undefined and null cases

        if (!isArrString(details.tags)) { return res.status(400).send({ status: false, msg: "tags must be in array of strings with appropriate elements" }) };

        if (!isArrString(details.category)) { return res.status(400).send({ status: false, msg: "category must be in array of strings with appropriate elements" }) };

        if(details["sub-category"]){
            if(!isArrString(details["sub-category"])){ return res.status(400).send({status:false, error: "subcategory must be in array of strings with appropriate elements"})}
        }
        if(details.publishedAt){
            if(typeof details.publishedAt !== "number"){return res.status(400).send({status:false, error: "publishedAt must be in date format(timestamps format i.e sec)"})};
        }
        if(details.isPublished){
            if(typeof details.isPublished !== "boolean"){return res.status(400).send({status:false, error: "isPublished value must be Boolean either true or false"})}
        }
        if(details.isDeleted){
            return res.status(403).send({status:false, error: "you are not allowed to add isDeleted field at creating of blog"})
        }
        if(details.deletedAt){
            return res.status(403).send({status:false, error: "you are not authorised to add deletedAt field"})
        }
        next();
    } catch (error) {
        console.log(error)
       return res.status(500).send({ status: false, error: error.name, msg: error.message })
    }
}



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

const authforQueryDelete = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        const decode = jwt.verify(token, "topScerect");
        const loggedInUserId = decode.authorId;

        let authorId = req.query.authorId;
        if (authorId && authorId.split("").length !== 24) { return res.status(400).send({ status: false, msg: "enter a valid id" }) } //validation1
        if (authorId && (authorId !== loggedInUserId)) { return res.status(400).send({ status: false, msg: "you are not authorised to delete blogs of different author" }) } //val2
        if (!authorId) { authorId = loggedInUserId }; //validation3
        req.query.authorId = authorId; //updating authorId qeury by loggedInUserId value
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, error: error.name, msg: error.message })
    }
}


// validating blog details coming for updating the blog
const validateToUpdate = async function (req, res, next) {
    try {
        const details = req.body;
        if(Object.keys(details).length === 0){return res.status(400).send({status:false, error : "can't update blog without any key-values"})}

        if(details.title){
            if (!isName(details.title)) { return res.status(400).send({ status: false, message: "title is can be alphnumeric with atleast 1st letter as uppercase, special chraracters not allowed except dot(.)" }) };
            details.title = details.title.trim();   //updating trimmed value of title in request body
        }
        if(details.body){
            if (!isBody(details.body)) { return res.status(400).send({ status: false, msg: "body must contains alphabets" }) };
        }
        if(details.authorId){
            if (!mongoose.Types.ObjectId.isValid(details.authorId)) { return res.status(400).send({ status: false, msg: "author id is mandatory and make sure it must be a valid mongoDB Id" }) };  //also validates for undefined and null cases
        }
        if(details.tags){
            if (!isArrString(details.tags)) { return res.status(400).send({ status: false, msg: "tags must be in array of strings with appropriate elements" }) };
        }
        if(details.category){
            if (!isArrString(details.category)) { return res.status(400).send({ status: false, msg: "category must be in array of strings with appropriate elements" }) };
        }
        if(details["sub-category"]){
            if(!isArrString(details["sub-category"])){ return res.status(400).send({status:false, error: "subcategory must be in array of strings with appropriate elements"})}
        }
        if(details.publishedAt){
            if(typeof details.publishedAt !== "number"){return res.status(400).send({status:false, error: "publishedAt must be in date format(timestamps format i.e sec)"})};
        }
        if(details.isPublished){
            if(typeof details.isPublished !== "boolean"){return res.status(400).send({status:false, error: "isPublished value must be Boolean either true or false"})}
        }
        if(details.isDeleted){
            return res.status(403).send({status:false, error: "you are not allowed to add isDeleted field in this way, to delete blog use other api"})
        }
        if(details.deletedAt){
            return res.status(403).send({status:false, error: "you are not authorised to add deletedAt field"})
        }
        next();
    } catch (error) {
        console.log(error)
       return res.status(500).send({ status: false, error: error.name, msg: error.message })
    }
}

module.exports.checkLogin = checkLogin;
module.exports.checkOwner = checkOwner;
module.exports.authForQueryDelete = authforQueryDelete;
module.exports.validateAuthor = validateAuthor;
module.exports.validateBlog = validateBlog;
module.exports.validateToUpdate = validateToUpdate;

