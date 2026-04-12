const validator = require('validator');

const validateSignUpData= (req)=> {
    const {firstName,lastName,emailId,password,gender} =req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("emailId is not valid");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("your password is not strong");
    }
    else if( gender <= 18) {
        throw new Error("Age must be grater than 18");
    }
}

const validateEditData= (req)=> {
    const ALLOWEDEDITFIELDS = ['firstName','lastName','age','gender','about'];

    const isAllowedUpdates = Object.keys(req.body).every(field=> ALLOWEDEDITFIELDS.includes(field));

    return isAllowedUpdates;
}

module.exports = {validateSignUpData, validateEditData};