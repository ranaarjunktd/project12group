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


module.exports.createAuthor = createAuthor;