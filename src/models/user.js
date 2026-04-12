const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
        if(!validator.isEmail(value)) {
            throw new Error("Invalid Email"+ value);
        }
    }
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    validate(value) {
        if(!['male','female','others'].includes(value)){
            throw new Error("Not Valid");
        }
    }
  },
  about: {
    type: String
  }
},{
    timestamps: true
});

userSchema.methods.isPasswordValid = async function (passwordInputByUser) {
    const user = this;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);

    return isPasswordValid;
}

userSchema.methods.JWTtoken = async function () {
    const user = this;

    const token = await jwt.sign({_id:user._id},"devtinder");

    return token;
}
module.exports = mongoose.model('User',userSchema);