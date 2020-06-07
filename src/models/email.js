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
    },
    Loggedin: {
        type: String,
        required: true,
        unique: false
    }
})



module.exports = mongoose.model('userinfo', userSchema)