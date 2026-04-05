const express = require('express');
const connectDB = require('./config/database');
const {adminauth} = require('./middlewares/auth');
const User = require('./models/user');
const app = express();

app.use(express.json()); //read the body from the body JSON which we sent from POSTMAN and convert it into object;
app.post('/signup', async(req,res)=> {

    const user = new User(req.body);
    try {
    await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send('Something went wrong'+err.message);
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
