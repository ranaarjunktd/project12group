
const mongoose=require('mongoose')

const collegeSchema=new mongoose.Schema( {
    name:{
        type:String,
        
       
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema)