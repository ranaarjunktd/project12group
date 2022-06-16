
const jwt = require("jsonwebtoken");
const { findById } = require("../models/userModel");
const userModel = require("../models/userModel");


//Q.1
const createUser = async function (abcd, xyz) {
  //You can name the req, res objects anything, but the first parameter is always the request and the second parameter is always the response
  try {
      let data = abcd.body;
      if (Object.keys(data).length === 0) {
        return xyz.status(400).send({ status: false, msg: "BAD REQUEST", reason: "body can't be empty" })
      }
      if (!data.mobile) {
        return xyz.status(400).send({ status: false, msg: "BAD REQUEST", reason: "mobile no. is a mandatory field" })
      }
      let savedData = await userModel.create(data);
      xyz.status(201).send({ msg: savedData });

  } catch (error) {
      xyz.status(500).send({ status: false, msg: "SERVER ERROR", reason: error.message })
  }

}


//Q.2 Write a *POST api /login to login a user that takes user details - email and password from the request body. If the credentials don't match with any user's data return a suitable error. On successful login, generate a JWT token and return it in response body.

const loginUser = async function (req, res) {
  try {
      if (!req.body.emailId || !req.body.password) return res.status(400).send({ status: false, msg: "please enter the emailId and password both" });

      let userName = req.body.emailId;
      let password = req.body.password;
      let user = await userModel.findOne({ emailId: userName, password: password });
      if (!user)
        return res.status(400).send({ status: false, msg: "username or the password is not corerct", });

      let token = jwt.sign(
        {
          userId: user._id.toString(),  //SN : since _id genereated by mongoDB is not a string, so converting it
          batch: "Radon",
          organisation: "FunctionUp",
        },
        "functionup-radon"  //secret keyword
      );

      res.setHeader("x-auth-token", token);  //SN: we can send response either into Header or just a display response..best practice - into header
      res.status(200).send({ status: true, token: token });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
};


//Q.3 Write a GET api /users/:userId to fetch user details. Pass the userId as path param in the url. Check that request must contain x-auth-token header. If absent, return a suitable error. If present, check that the token is valid.

const getUserData = async function (req, res) {
  try {
      let userDetails = await userModel.findById(req.params.userId);
      res.status(200).send({ status: true, data: userDetails });

  } catch (error) {
      res.status(500).send({ status: false, msg1: error.name, msg2: error.message, msg3: error })
  }
};

//Q.4 Write a PUT api /users/:userId to update user details. Pass the userId as path param in the url and update the attributes received in the request body. Check that request must contain x-auth-token header. If absent, return a suitable error.

const updateUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userData = req.body;
    if(Object.keys(userData).length === 0) return res.status(400).send({status: false, msg : "error: please enter something to update"});

    let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true });
    res.status(200).send({ status: "updatedUser", data: updatedUser });

  } catch (error) {
    res.status(500).send({ status: false, msg1: error.name, msg2: error.message })
  }

};

//Q.5 Write a DELETE api /users/:userId that takes the userId in the path params and marks the isDeleted attribute for a user as true. Check that request must contain x-auth-token header. If absent, return a suitable error.

const deleteUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    const markDelete = await userModel.findById(userId).updateOne({}, { $set: { isDeleted: true } });
    res.status(200).send({ status: "userDeleted", msg: markDelete })
  } catch (error) {
    res.status(500).send({ status: false, msg1: error.name, msg2: error.message })
  }
}

//Q.6
const postMessage = async function (req, res) {
  //update
  try {
    const message = req.body.message;
    if(!message) return res.status(400).send({status: false, msg : "please write the message before posting it"}
    )
    const user = await userModel.findById(req.params.userId)
    const postsAttribute = user.posts;
    // const addingPost = post.push(message) -------- and then (post:  addingPost) =>big mistake, because adddingPost(push) gives new array length after adding.
    postsAttribute.push(message)
    const addingPost = await userModel.findOneAndUpdate({ _id: user._id }, { $set: { posts: postsAttribute } }, { new: true }) //{posts : postsAttribute} or {$set: {posts : postsAttribute}} in both way we can write
    res.status(200).send({ status: true, msg: addingPost })
  } catch (error) {
    res.status(500).send({ status: false, msg1: error.name, msg2: error.message })
  }


}




module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
module.exports.postMessage = postMessage;

