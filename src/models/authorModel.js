const mongoose = require('mongoose'); require('mongoose-type-email');

const authorSchema = new mongoose.Schema({
    firstName: {type: String, required: true},  //use regex for name validation
    lastName: {type: String, required: true},
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]     //use simple logic to validate it
        },
    email: {
        type: mongoose.SchemaTypes.Email,   //use regex for proper format
        required: true,
        unique: true        //make db call
    },
    password:{type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Author", authorSchema )