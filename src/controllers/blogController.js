const authorModel = require('../models/authorModel.js');
const blogModel = require('../models/blogModel.js');
const jwt = require('jsonwebtoken');




const createBlog = async function (req, res) {      
    try {                                                                                                   //trim=>handle only space in string like "   "
        const content = req.body;       
        const savedData = await blogModel.create(content);
        return res.status(201).send({ status: true, data: savedData });
    } catch (err) {
        console.log(err)
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
        if (ctg) { filters.category = { $all: ctg.split(",").map((x)=>x.trim()) } };
        if (tag) { filters.tags = { $all: tag.split(",").map((x)=>x.trim()) } };
        if (subCtg) { filters["sub-category"] = { $all: subCtg.split(",").map((x)=>x.trim()) } };

        const documents = await blogModel.find(filters);    //empty array
        if (documents.length == 0) { return res.status(404).send({ status: false, msg: "no such documents with specified condiontions" }) };  //validation2

        return res.status(200).send({ status: true, data: documents })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, erroor: err.name, msg: err.message})
        
    }
}


//Updates a blog by changing the its title, body, adding tags, adding a subcategory.Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true

const updateBlog = async function (req, res) {
    try {
        const Id = req.params.blogId;
        let data = req.body;
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: "cannot update empty body" }) };   //validation1

        const blog = await blogModel.findById(Id);  //already validated in mw-checkOwner

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
        return res.status(200).send({ status: true, data: updated });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, error: err.name, msg: err.message })  //server error
    }
}


const deleteById = async function(req,res){
    try {
        const id = req.params.blogId;
        const blog = await blogModel.findById(id);
        if(!blog || blog.isDeleted === true){return res.status(404).send({status:false, msg: "no such blog exists"})};//validation1
        
        const d = new Date; const dateTime = d.toLocaleString();

        const deleteBlog = await blogModel.findByIdAndUpdate(id, {$set: {isDeleted: true, deletedAt: dateTime}});
        return res.status(200).send({status:true, msg: "blog deleted successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, error: error.name, msg: error.message})
    }
}




const deleteByQuery = async function(req, res){
    try {            
        let {authorId, category, tags, isPublished} = req.query;
        const subCtg = req.query["sub-category"];

        let filters = {isDeleted:false};
        if(authorId){filters.authorId = authorId};
        if(category){filters.category = {$all: category.split(",").map((x)=>x.trim())}};
        if(tags){filters.tags = {$all: tags.split(",").map((x)=>x.trim())}};
        if(subCtg){filters[subCtg] = {$all:subCtg.split(",").map((x)=>x.trim())}};
        if(isPublished){filters.isPublished = isPublished};                           

        const filteredBlogs = await blogModel.findOne(filters);           //filters 
        if(!filteredBlogs){return res.status(404).send({status:false,   msg: "no match found for deleting" })}  //validation

        const d = new Date; const dateTime = d.toLocaleString();

        const deleted = await blogModel.updateMany(filters,{$set:{isDeleted:true, deletedAt: dateTime}});
        return  res.status(200).send({status:true, msg: "deleted successfully", msg2: deleted});

        
    } catch (error) {
        console.log(error);//remove it
        return res.status(500).send({status:false, error:error.name, msg: error.message});
    }
}









module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.listBlogsByQuery = listBlogsByQuery;
module.exports.deleteById = deleteById
module.exports.deleteByQuery = deleteByQuery;




