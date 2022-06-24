const authorModel = require('../models/authorModel.js');
const blogModel = require('../models/blogModel.js');
const jwt = require('jsonwebtoken');




const createBlog = async function (req, res) {      
    try {                                                                                                   //trim=>handle only space in string like "   "
        const content = req.body;       //empty object
        if (Object.keys(content).length === 0) { return res.staus(400).send({ status: false, msg: "no content in the document" }); } //validation1

        if(!isValid(content.title) || !isValid(content.body) || !isValid(content.authorId) || !isValid(content.category)){
            return res.status(400).send({status:false, msg: "name, body, authorId and category must be entered, you cannot left these field empty"})
        }// validation2

        const savedData = await blogModel.create(content);
        res.status(201).send({ status: true, data: savedData });
    } catch (err) {
        return res.status(500).send({ status: false, error: err.name, msg: err.message })
    }
}


//Filter blogs list by applying filters. Query param can have any combination of below filters.By author Id, By category, List of blogs that have a specific tag, List of blogs that have a specific subcategory

const listBlogsByQuery = async function (req, res) {
    try {
        const aId = req.query.authorId;
        const ctg = req.query.category;
        const tag = req.query.tags;
        const subCtg = req.query["sub-category"];

        let filters = { isDeleted: false, isPublished: true };
        if (aId) { 
            if(aId.split("").length != 24){return res.status(400).send({status:false, msg:"enter a valid authorId"})};  //Validation1
            filters.authorId = aId
        };
        if (ctg) { filters.category = { $all: ctg.split(",") } };
        if (tag) { filters.tags = { $all: tag.split(",") } };
        if (subCtg) { filters["sub-category"] = { $all: subCtg.split(",") } };

        const documents = await blogModel.find(filters);    //empty array
        if (documents.length == 0) { return res.status(404).send({ status: false, msg: "no such documents with specified condiontions" }) };  //validation2

        res.status(200).send({ status: true, data: documents })
    } catch (err) {
        res.status(500).send({ status: false, erroor: err.name, msg: err.message})
        console.log(err)
    }
}


//Updates a blog by changing the its title, body, adding tags, adding a subcategory.Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true

const updateBlog = async function (req, res) {
    try {
        const Id = req.params.blogId;
        if(Id.split("").length != 24){return res.status(400).send({status:false, msg:"enter a valid authorId"})};  //Validation1    //use mongooseObject Id format
        let data = req.body;
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: "cannot update empty body" }) };   //validation2

        const blog = await blogModel.findById(Id);
        if (!blog) { return res.status(404).send({ status: false, error: "blog not found" }) };    //validation3

        if (data.tags) {
            data.tags = [...blog.tags, ...data.tags];
        }
        if (data.category) {
            data.category = [...blog.category, ...data.category];
        }
        if (data["sub-category"]) {
            data["sub-category"] = [...blog["sub-category"], ...data["sub-category"]]   //$addToSet, $push, $set, $inc
        }

        const updated = await blogModel.findByIdAndUpdate(Id, { $set: { ...data, isPublished: true, publishedAt: Date.now() } }, { new: true });
        res.status(200).send({ status: true, data: updated });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.name, msg: err.message })  //server error
    }
}


const deleteById = async function(req,res){
    try {
        const id = req.params.blogId;
        const blog = await blogModel.findById(id);
        if(!blog || blog.isDeleted === true){return res.status(404).send({status:false, msg: "no such blog exists"})};//validation1
        
        const d = new Date; const dateTime = d.toLocaleString();

        const deleteBlog = await blogModel.findByIdAndUpdate(id, {$set: {isDeleted: true, deletedAt: dateTime}},{new:true});
        return res.status(200).send({status:true, msg: "blog deleted successfully"});

    } catch (error) {
        return res.status(500).send({status:false, error: error.name, msg: error.message})
    }
}



const deleteByQuery = async function(req, res){
    try {            
        const authorId = req.query.authorId;         //use destructuring to make it compact                 
        const ctg = req.query.category;
        const tag = req.query.tags;
        const subCtg = req.query["sub-category"];
        const pub = req.query.isPublished;

        let filters = {isDeleted:false};
        if(authorId){filters.authorId = authorId};
        if(ctg){filters.category = {$all: ctg.split(",")}};
        if(tag){filters.tags = {$all: tag.split(",")}};
        if(subCtg){filters["sub-category"] = {$all:subCtg.split(",")}};
        if(pub){filters.isPublished = pub};                           

        const filteredBlogs = await blogModel.findOne(filters);           //filters 
        if(!filteredBlogs){return res.status(404).send({status:false,   msg: "no match found for deleting" })}

        const d = new Date; const dateTime = d.toLocaleString();

        const deletedBlogs = await blogModel.updateMany(filters,{$set:{isDeleted:true, deletedAt: dateTime}});
        return  res.status(200).send({status:true, msg: "deleted successfully", msg2: deletedBlogs});

        
    } catch (error) {
        console.log(error);//remove it
        return res.status(500).send({status:false, error:error.name, msg: error.message});
    }
}
//remainings
//write dateTime in common function; //when isDeleted = false updating, then automatically update deletedAt = "N.A"








module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.listBlogsByQuery = listBlogsByQuery;
module.exports.deleteById = deleteById
module.exports.deleteByQuery = deleteByQuery;




