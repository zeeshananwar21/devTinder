const express = require('express');
const {validateSignUpData} = require("../utils/validation");
const bcrypt =require('bcrypt');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post('/signup', async(req,res)=> {

    
    try {
        //validation user data
        validateSignUpData(req);

        //encrypt the data
        const {firstName,lastName,gender,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
    const user = new User({
        firstName,
        lastName,
        emailId,
        gender,
        password: passwordHash
    });
    await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send('Something went wrong' + err.message);
    }
})

authRouter.post('/login', async(req,res)=> {
    try {
       const {emailId,password} = req.body;
       const user = await User.findOne({emailId: emailId});

       if(!user) {
        throw new Error("Invalid Credentials");
       }
       const isValidPassword = await user.isPasswordValid(password);
       if(isValidPassword){

            //create a JWT
            const token = await user.JWTtoken();

            // send back the jwt to the user
            res.cookie('token', token);
        

        res.send("Login Successful");
       }
       else {
        res.status(400).send('Invalid Credentials');
       }
    }
    catch(err){
        res.status(400).send('Something went wrong' + err.message);
    }
})

authRouter.post('/logout', (req,res)=> {
    res.cookie("token",null, {
        expires: new Date(Date.now())
    })
    res.send('Logout Succesfully');
})

module.exports = authRouter;