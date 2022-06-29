const mongoose=require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createIntern = async function (req,res){

    let data = req.body

     // Edge cases
     if(Object.keys(data).length==0){
        res .status(400).send({ status:false , msg:"Please provide the college details"})
    }

    if(!req.body.name){
        res.status(400).send({status:false , msg:"Name is required"})
    }
    if(!req.body.email){
        res.status(400).send({status:false , msg:"Email is required"})
    }
    if(!req.body.mobile){
        res.status(400).send({status:false , msg:"Mobile is required"})
    }
    if(!req.body.collegeId){
        res.status(400).send({status:false , msg:"collegeId is required"})
    }

    // checking name in alphbet only
    
    let regexName = /^\s*(?=[A-Z])[\w\.\s]{2,64}\s*$/
    
    if(!regexName.test(req.body.name)){
        res.status(400).send({status:false , msg:"Name should be alphabat type"})
    }

    // EMAIL DUPLICAY AND SYNTAX for validation



     if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(req.body.email))) {
        return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
      }
  
      const isEmailPresent = await internModel.findOne({ email: req.body.email })
  
      if (isEmailPresent) {
        return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }


     // Mobile DUPLICAY AND SYNTAX for validation

    let regexMobile = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    if(!regexMobile.test(req.body.mobile)){
        
        return res.status(400).send({ status: false, msg: "Mobile is not valid" })
    }
    
    const isMobilePresent = await internModel.findOne({ mobile: req.body.mobile })

    if (isMobilePresent) {
      return res.status(400).send({ status: false, msg: "Mobile is already register" })
  }



  let collegeCheck = await internModel.findById({_id:req.body.collegeId})

  if(!collegeCheck){

      let college = await internModel.create(data)
      res.status(200).send({status:true, msg:"college create successfully",data:college})
      }
      else{
          res.status(400).send({status:false , msg:"collegeId is already register"})
      }


}

module.exports.createIntern = createIntern