const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const middleware= require('../middlewares/auth.js')



router.post("/createUser", userController.createUser )  //Q.1
router.post("/loginUser", userController.loginUser)     //Q.2

//The userId is sent by front end
router.get("/users/:userId", middleware.validateToken, userController.getUserData)      //Q.3
router.put("/users/:userId", middleware.validateToken, userController.updateUser)       //Q.4
router.delete("/users/:userId", middleware.validateToken, userController.deleteUser);   //Q.5

module.exports = router; 