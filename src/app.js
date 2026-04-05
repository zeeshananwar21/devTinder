const express = require('express');
const connectDB = require('./config/database');
const {adminauth} = require('./middlewares/auth');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const validateSignUpData = require("./utils/validation");
const app = express();

app.use(express.json()); //read the body from the body JSON which we sent from POSTMAN and convert it into object;
app.post('/signup', async(req,res)=> {

    
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

app.post('/login', async(req,res)=> {

    
    try {
       const {emailId,password} = req.body;
       const user = await User.findOne({emailId: emailId});

       if(!user) {
        throw new Error("Invalid Credentials");
       }
       const isValidPassword = await bcrypt.compare(password, user.password);
       if(isValidPassword){
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

app.patch('/user/:userId', async(req,res)=> {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['gender', 'age'];
        const isAllowedUpdates = Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k));
        if(!isAllowedUpdates) {
            throw new Error('update not allowed');
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: 'after', runValidators: true});
        
    res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send('Something went wrong'+err.message);
    }
})

app.get('/feed', async(req,res)=> {
    const data = await User.find({});
    res.send(data);
})

connectDB()
.then(()=> {
    console.log("Database connection established")
    app.listen(3000,()=> {
    console.log("Server is listening on port 3000");
})
})
.catch((err)=>console.log("Database connection not established"+err.message));
