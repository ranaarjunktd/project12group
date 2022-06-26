const mongoose = require('mongoose'); require('mongoose-type-email');

const authorSchema = new mongoose.Schema({
    firstName: {type: String, required: true},  
    lastName: {type: String, required: true},
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]     
        },
    email: {
        type: mongoose.SchemaTypes.Email,   
        required: true,
        unique: true      
    },
    password:{type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Author", authorSchema )