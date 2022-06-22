const authorModel = require('../models/authorModel.js');
const { findByIdAndUpdate, findById } = require('../models/blogModel.js');
const blogModel = require('../models/blogModel.js');
const jwt = require('jsonwebtoken');


const createBlog = async function (req, res) {
    try {
        const content = req.body;       //empty object
        if (Object.keys(content).length === 0) { return res.staus(400).send({ status: false, msg: "no content in the document" }); } //validation1

        if(!content.title || !content.body || !content.authorId || !content.category){
            return res.status(400).send({status:false, msg: "name, body, authorId and category must be entered, you cannot left these field empty"})
        }// validation2

        const savedData = await blogModel.create(content);
        res.status(201).send({ status: true, data: savedData });
    } catch (err) {
        return res.status(500).send({ status: false, error: err.name, msg: err.message })
    }
}

/*
//Returns all blogs in the collection that aren't deleted and are published

const listBlogs = async function(req, res){
    try {
        const list = await blogModel.find({isDeleted:false, isPublished:true});
        return res.status(200).send({status:true, data: list});
    } catch (err) {
        return res.status(500).send({status:false, error: err.name, msg: err.message})
    }
}
*/


//Filter blogs list by applying filters. Query param can have any combination of below filters.By author Id, By category, List of blogs that have a specific tag, List of blogs that have a specific subcategory

const listBlogsByQuery = async function (req, res) {
    try {
        const aId = req.query.authorId;
        if(aId.split("").length != 24){return res.status(400).send({status:false, msg:"enter a valid authorId"})};  //Validation1
        const ctg = req.query.category;
        const tag = req.query.tags;
        const subCtg = req.query["sub-category"];

        let filters = { isDeleted: false, isPublished: true };
        if (aId) { filters.authorId = aId };
        if (ctg) { filters.category = { $all: ctg.split(",") } };
        if (tag) { filters.tags = { $all: tag.split(",") } };
        if (subCtg) { filters["sub-category"] = { $all: subCtg.split(",") } };

        const documents = await blogModel.find(filters);    //empty array
        if (documents.length == 0) { return res.status(404).send({ status: false, msg: "no such documents with specified condiontions" }) };  //validation2

        res.status(200).send({ status: true, data: documents })
    } catch (err) {
        res.status(500).send({ status: false, erroor: err.name, msg: err.message })
    }
}


//Updates a blog by changing the its title, body, adding tags, adding a subcategory.Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true

const updateBlog = async function (req, res) {
    try {
        const Id = req.params.blogId;
        if(Id.split("").length != 24){return res.status(400).send({status:false, msg:"enter a valid authorId"})};  //Validation1
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
            data["sub-category"] = [...blog["sub-category"], ...data["sub-category"]]   //$addToSet, $set, $inc
        }

        const updated = await blogModel.findByIdAndUpdate(Id, { $set: { ...data, isPublished: true, publishedAt: Date.now() } }, { new: true });
        res.status(200).send({ status: true, data: updated });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.name, msg: err.message })  //server error
    }
}

//delete 1 => done by aman
//dlete 2 => done by aman












module.exports.createBlog = createBlog;
// module.exports.listBlogs = listBlogs;
module.exports.updateBlog = updateBlog;
module.exports.listBlogsByQuery = listBlogsByQuery;





