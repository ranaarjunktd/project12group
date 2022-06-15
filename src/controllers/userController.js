const jwt = require("jsonwebtoken");
const { findById } = require("../models/userModel");
const userModel = require("../models/userModel");


//Q.1
const createUser = async function (abcd, xyz) {
  //You can name the req, res objects anything.
  //but the first parameter is always the request 
  //the second parameter is always the response
  let data = abcd.body;
  let savedData = await userModel.create(data);
  xyz.send({ msg: savedData });
}

//Q.2 Write a *POST api /login to login a user that takes user details - email and password from the request body. If the credentials don't match with any user's data return a suitable error. On successful login, generate a JWT token and return it in response body.
const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret
  // The same secret will be used to decode tokens
  let token = jwt.sign(
    {
      userId: user._id.toString(),  //SN : since _id genereated by mongoDB is not a string, so converting it
      batch: "Radon",
      organisation: "FunctionUp",
    },
    "functionup-radon"  //secret keyword
  );
  res.setHeader("x-auth-token", token);  //SN: we can send response either into Header or just a display response..best practice - into header
  res.send({ status: true, token: token });
};


//Q.3 Write a GET api /users/:userId to fetch user details. Pass the userId as path param in the url. Check that request must contain x-auth-token header. If absent, return a suitable error. If present, check that the token is valid.

const getUserData = async function (req, res) {

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
};

//Q.4 Write a PUT api /users/:userId to update user details. Pass the userId as path param in the url and update the attributes received in the request body. Check that request must contain x-auth-token header. If absent, return a suitable error.

const updateUser = async function (req, res) {

  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if(!user) return res.send("No such user exists in db collection");
  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, {new:true});
  res.send({ status: "updatedUser", data: updatedUser });
};

//Q.5 Write a DELETE api /users/:userId that takes the userId in the path params and marks the isDeleted attribute for a user as true. Check that request must contain x-auth-token header. If absent, return a suitable error.

const deleteUser = async function(req, res){ 
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if(!user) return res.send("No such user exists in db collection");

  const markDelete = await userModel.findById(userId).updateOne({}, {$set:{isDeleted:true}});

  res.send({status: "userDeleted", msg: markDelete})
}

//Q.6
const postMessage = async function(req, res){
  //update
  const message = req.body.message;
  const user = await userModel.findById(req.params.userId)
  const postsAttribute = user.posts;
  // const addingPost = post.push(message) -------- and then (post:  addingPost) =>big mistake, because adddingPost(push) gives new array length after adding.
  postsAttribute.push(message)
  const addingPost = await userModel.findOneAndUpdate({_id: user._id}, {$set:{posts : postsAttribute}},{new:true}) //{posts : postsAttribute} or {$set: {posts : postsAttribute}} in both way we can write
  res.send({status: true, msg: addingPost})
  
}




module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
module.exports.postMessage = postMessage;

