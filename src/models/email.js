let mongoose = require('mongoose')
let validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (checker) => {
            return validator.isEmail(checker)
        }
    }
})



module.exports = mongoose.model('userinfo', userSchema)