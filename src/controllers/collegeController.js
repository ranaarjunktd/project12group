const mongoose = require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createCollege = async function (req, res) {
    try {
        // Edge cases
        let data = req.body

        //this is for if user or student provide given an empty body
        if (Object.keys(data).length == 0) {
           return res.status(400).send({ status: false, msg: "Please provide the college details" })
        };
        //particular each required feild is mandetory
        if (!data.name) {
           return res.status(400).send({ status: false, msg: "Name is required" })
        };
        if (!data.fullName) {
           return res.status(400).send({ status: false, msg: "FullName is required" })
        };
        if (!data.logoLink) {
           return res.status(400).send({ status: false, msg: "logoLink is required" })
        };
        //checking name and fullname in alphabet only

        if (!(/^\s*([a-zA-Z\s\,]){2,64}\s*$/.test(data.name))) {
           return res.status(400).send({ status: false, msg: "Name should be in alphabat type" })
        };
        if (!(/^\s*([a-zA-Z\s\,]){2,64}\s*$/.test(data.fullName))) {
           return res.status(400).send({ status: false, msg: "fullname should be in alphabat type" })
        };

        //checking logo format
        if (!(/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i.test(data.logoLink))) {
           return res.status(400).send({ status: false, msg: "Logolink is not in correct format" })
        };

        //checking college fullname is already registerd or not
        let isValidfullName = await collegeModel.findOne({fullName:data.fullName});
        if (isValidfullName) {
            return res.status(400).send({ status: false, message: "College fullName is already registered", })
        };

        //checking the name is unique or not
        let nameCheck = await collegeModel.findOne({ name: data.name });
        if (!nameCheck) {
            let college = await collegeModel.create(data)
           return res.status(200).send({ status: true, msg: "college create successfully", data: college });
        }
        else {
           return res.status(400).send({ status: false, msg: "Name should be unique" });
        }
    } catch (err) {
        console.log("This is the error :", err.message);
       return res.status(500).send({ msg: "Error", error: err.message });
    }

};


// GET COLLEGE DETAILS   ===============>

const getCollegeDetails = async function (req, res) {
    
    try {
        let data = req.query

        // console.log(data)

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide the college details" })
         };

        // let CollegeName = data.collegeName

        // console.log(CollegeName)

        const getCollegeDetail = await collegeModel.findOne({name: data.collegeName})

        // console.log(getCollegeDetail)

        if (!getCollegeDetail) return res.status(404).send({
            status: false,
            message: " please provide correct college name"
        })


        const collegeId = getCollegeDetail._id

        // console.log(collegeId)


        const findIntern = await internModel.find({
            collegeId: collegeId,
            isDeleted: false
        }).select({ name: 1, email: 1, mobile: 1 })

        // console.log(findIntern)
 

        if(findIntern.length == 0) return res.status(404).send({
            status:false,
            message :"No intern enrolled with this college" 
        })


        let finalData = {
            name: getCollegeDetail.name,
            fullName: getCollegeDetail.fullName,
            logoLink: getCollegeDetail.logoLink,
            interns: findIntern
        }

        // console.log(finalData)

        res.status(200).send({
            status: true,
            message: "college interns details",
            data: finalData
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails



