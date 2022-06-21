const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    
    title: {type:String, required:true},
    body: {
        type:mongoose.Schema.Types.Mixed, 
        required:true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required:true
    },
    tags:[String],
    category: {
        type: [String],
        required: true
    },
    "sub-category":[],
    publishedAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {type: Boolean, default: false},
    isDeleted : {
        type: Boolean,
        default: false
    },
    deletedAt : String

},{timestamps: true});


module.exports = mongoose.model("blog", blogSchema)