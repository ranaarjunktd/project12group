const mongoose=require('mongoose')
const ObjectId= mongoose.Schema.Types.ObjectId
const validator= require('validator')

const internSchema=new mongoose.Schema( {

    name:{ type:String, required:true},
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')

            }  }
    },
    mobile:{ },
    collegeId: {type:ObjectId,ref:'College'}, 
    isDeleted: {type:Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema)