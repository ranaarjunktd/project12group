const mongoose=require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createIntern = async function (req,res){
try{
    let data = req.body

     // Edge cases
     //if user or student given a empty body
     if(Object.keys(data).length==0){
        res .status(400).send({ status:false , msg:"Please provide the college details"})
    }
    //each required feild is mandetory
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

    // checking email is in right format or not and also the email is unique or not

     if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(req.body.email))) {
        return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
      }
  
      const isEmailPresent = await internModel.findOne({ email: req.body.email })
  
      if (isEmailPresent) {
        return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }


     //checking mobile is in right format or not and also the mobile is present or not in our database

    let regexMobile = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    if(!regexMobile.test(req.body.mobile)){
        
        return res.status(400).send({ status: false, msg: "Mobile is not valid" })
    }
    
    const isMobilePresent = await internModel.findOne({ mobile: req.body.mobile })

    if (isMobilePresent) {
      return res.status(400).send({ status: false, msg: "Mobile is already register" })
  }



  let collegeCheck = await internModel.findById({_id:req.body.collegeId}) //check

  if(!collegeCheck){

      let college = await internModel.create(data)
      res.status(200).send({status:true, msg:"college create successfully",data:college})
      }
      else{
          res.status(400).send({status:false , msg:"collegeId is already register"})
      }
} catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
}

}

module.exports.createIntern = createIntern

//mobile: /^[0]?[6789]\d{9}$/