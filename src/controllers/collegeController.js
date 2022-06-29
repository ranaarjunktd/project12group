
const mongoose=require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createCollege = async function (req,res){

    let data = req.body

    // Edge cases
    if(Object.keys(data).length==0){
        res .status(400).send({ status:false , msg:"Please provide the blog details"})
    }

    if(!req.body.name){
        res.status(400).send({status:false , msg:"Name is required"})
    }
    if(!req.body.fullName){
        res.status(400).send({status:false , msg:"fullName is required"})
    }
    if(!req.body.logoLink){
        res.status(400).send({status:false , msg:"logoLink is required"})
    }

    
    let regexName = /^\s*([a-zA-Z\s\,])([^0-9]){2,64}\s*$/



    // iind regex for the url
    // const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w -])?\??(?:[-\+=&;%@.\w])#?(?:[\w]*))?)/



    if(!regexName.test(req.body.name)){
        res.status(400).send({status:false , msg:"Name should be alphabat type"})
    }
    if(!regexName.test(req.body.fullName)){
        res.status(400).send({status:false , msg:"fullname should be alphabat type"})
    }

    

    let nameCheck = await collegeModel.findOne({name:req.body.name})
    if(!nameCheck){
        let college = await collegeModel.create(data)
        res.status(200).send({status:true, msg:"college create successfully",data:college})
        }
        else{
            res.status(400).send({status:false , msg:"Name should be unique"})
        }
        
    


}


module.exports.createCollege = createCollege




