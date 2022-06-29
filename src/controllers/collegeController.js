
const mongoose= require('mongoose')
const collegeModel = require("../model/collegeModel")
//const internModel = require("../model/internModel")

const createCollege = async function (req,res){
try{
    let data = req.body

    // Edge cases
    //this is for if user or student provide given an empty body
    if(Object.keys(data).length==0){
        res .status(400).send({ status:false , msg:"Please provide the college details"})
    }
    //particular each required feild is mandetory
    if(!req.body.name){
        res.status(400).send({status:false , msg:"Name is required"})
    }
    if(!req.body.fullName){
        res.status(400).send({status:false , msg:"FullName is required"})
    }
    if(!req.body.logoLink){
        res.status(400).send({status:false , msg:"logoLink is required"})
    }
    //checking name and fullname in alphabet only
    let regexName = /^\s*(?=[A-Z])[\w\.\s]{2,64}\s*$/

    if(!regexName.test(req.body.name)){
        res.status(400).send({status:false , msg:"Name should be alphabat type"})
    }
    if(!regexName.test(req.body.fullName)){
        res.status(400).send({status:false , msg:"fullname should be alphabat type"})
    }

    //checking the name is unique or not
    let nameCheck = await collegeModel.findOne({name:req.body.name})
    if(!nameCheck){
        let college = await collegeModel.create(data)
        res.status(200).send({status:true, msg:"college create successfully",data:college})
        }
        else{
            res.status(400).send({status:false , msg:"Name should be unique"})
        }
} catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
}     

}


module.exports.createCollege = createCollege




