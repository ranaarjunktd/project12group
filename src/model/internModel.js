const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},

    email:{
            require: true,
            type: String,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: "{VALUE} is not a valid email",
                isAsync: false
            },
            trim:true
        },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        trim:true
        },
    collegeId:{
       type:ObjectId,
       required:true,
       ref:"College"
        },
    isDeleted: {type:Boolean,default:false}

},{timestamps:true})



module.exports = mongoose.model('Intern', internSchema)