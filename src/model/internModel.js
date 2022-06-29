const internSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is mandatory"],
        trim:true

    },
    email:{
        type:String,
        required:[true,"email is mandatory"],
        unique:true,
        validate:emailValidation,
        trim:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        validate:mobileValidation,
        trim:true
},
collegeId:{
    type:ObjectId,
    ref:"College"
},
isDeleted:{
    type:Boolean,
    default:false
}

},
{timestamps:true})



module.exports =mongoose.model('Intern',internSchema)
