const mongoose = require('mongoose')
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const createIntern = async function (req, res) {
    try {
        let data = req.body

        // Edge cases
        //if user or student given a empty body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide the college details" })
        };
        //each required field is mandetory
        if (!data.name) {
            return res.status(400).send({ status: false, msg: "Name is required" })
        };
        if (!data.email) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };
        if (!data.mobile) {
            return res.status(400).send({ status: false, msg: "Mobile is required" })
        };
        if (!data.collegeId) {
            return res.status(400).send({ status: false, msg: "collegeId is required" })
        };

        // checking name in alphbet only

        if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.name))) {
            return res.status(400).send({ status: false, msg: "Name should be alphabat type" })
        };

        // checking email is in right format or not and also the email is unique or not

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
            return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
        };

        const isEmailPresent = await internModel.findOne({ email: data.email })

        if (isEmailPresent) {
            return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
        };


        //checking mobile is in right format or not and also the mobile is present or not in our database

        if (!(/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(data.mobile))) {

            return res.status(400).send({ status: false, msg: "Mobile is not valid" })
        };

        const isMobilePresent = await internModel.findOne({ mobile: data.mobile })

        if (isMobilePresent) {
            return res.status(400).send({ status: false, msg: "Mobile is already register" })
        };

        // let collegeId=data.collegeId

        let collegeCheck = await collegeModel.findById({ _id: data.collegeId })

        if (collegeCheck) {

            let college = await internModel.create(data)
            return res.status(201).send({ status: true, data: college })
        }
        else {
            return res.status(400).send({ status: false, msg: "CollegeId was not found" })
        };

    } catch (err) {
        console.log("This is the error :", err.message);
        return res.status(500).send({ msg: "Error", error: err.message });
    }

};


module.exports.createIntern = createIntern
