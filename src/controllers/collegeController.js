
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
    if(!(/^\s*(?=[A-Z])[\w\.\s]{2,64}\s*$/.test(req.body.name))){
        res.status(400).send({status:false , msg:"Name should be alphabat type"})
    }
    if(!(/^\s*(?=[A-Z])[\w\.\s]{2,64}\s*$/.test(req.body.fullName))){
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
    res.status(500).send({ msg: "Error", err: err.message });
}     

}

let regType01 = /^[A-Za-z]{2,}$/ // for college abbrivation

const getData = async function (req, res) {
    try {
        let data = req.query.collegeName;

        if (!data || !regType01.test(data)) {
            return res.status(400).send({ status: false, message: "querry params need a valid College Abbriviation Name" })
        }
        let ExistedCN = await collegeModel.findOne({ name: data })
        if (!ExistedCN) {
            return res.status(400).send({ status: false, message: "The college Name is not existed" })
        }

        // let coId = await collegeModel.findOne({ name: data })
        // if (coId.length == 0) {
        //     return res.status(404).send({ status: false, message: "No such College Name found" })
        // }

        let coId01 = await collegeModel.findOne({
            name: data
        }).select({
            _id: 0, name: 1, fullName: 1, logoLink: 1
        })

        console.log(coId01)

        let intern = await internModel.find({ collegeId:  coId01 }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        // console.log(intern)
        let interest = [];
        interest = interest.concat(intern)
        console.log(interest)
        res.send({ data: coId01, interest })
    }
    catch {
        res.status(400).send({ status: false, message: "Bad Request!" })
    }
}



module.exports.createCollege = createCollege
module.exports.getData = getData




