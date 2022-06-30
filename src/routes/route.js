const express = require('express');
const router = express.Router();

const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")

let {createCollege,getCollegeDetails} = collegeController    //Destractaring 


router.post("/functionup/colleges",createCollege)

router.post("/functionup/interns",internController.createIntern)

router.get("/functionup/collegeDetails",getCollegeDetails)


module.exports = router;
