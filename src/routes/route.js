const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const middleware= require('../middlewares/auth.js')



router.post("/createUser", userController.createUser )  //Q.1
router.post("/loginUser", userController.loginUser)     //Q.2

//The userId is sent by front end

router.get("/users/:userId", middleware.validateToken, middleware.validateUser,  userController.getUserData)      //Q.3
router.put("/users/:userId", middleware.validateToken, middleware.validateUser, userController.updateUser)       //Q.4
router.delete("/users/:userId", middleware.validateToken, middleware.validateUser, userController.deleteUser);   //Q.5
router.put('/addPost/:userId', middleware.validateToken, middleware.validateUser, userController.postMessage) //Q.6 given on 15/06/2022

module.exports = router; 