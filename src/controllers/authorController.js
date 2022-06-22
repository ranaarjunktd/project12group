const authorModel = require("../models/authorModel.js");

const createAuthor = async function (req, res) {
   try {
      const content = req.body;
      if (Object.keys(content).length === 0) {
         console.log(err.message)
         return res.status(400).send({ status: false, msg: "no content in the document" });
      }
      const savedData = await authorModel.create(content);
      res.status(201).send({ status: true, data: savedData })
   } catch (error) {
      return res.status(500).send({ status: false, errorName: error.name, msg: error.message });
   }
}


/*==================================================================PHASE 2=============================================================================
Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId
If the credentials are incorrect return a suitable error message with a valid HTTP status code
*/
const login = async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) { return res.status(400).send({ status: false, error: "please enter email and password" }) }; //validation1

        const author = await authorModel.findOne({ email: email, password: password });
        if (!author) { return res.status(404).send({ status: false, msg: "invalid userEmail or password" }) }; //validation2

        const token = jwt.sign({ authorId: author._id, collection: "authors", project: "Blog" }, "topScerect");

        res.setHeader.send("x-api-key", token);
        res.status(200).send({ status: true, msg: "congratulations!!! your login is succesful" });
    } catch (err) {
        return res.status(500).send({ status: false, error: err.name, msg: err.message });
    }
}
module.exports.createAuthor = createAuthor;
module.exports.login =login;