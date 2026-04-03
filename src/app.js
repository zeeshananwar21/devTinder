const express = require('express');

const {adminauth} = require('./middlewares/auth');
const app = express();


app.use('/admin', adminauth)
app.get("/admin/getAllData",(req,res)=> {
    // route handler
    res.send("All Data Sent");
})


app.get("/admin/deleteAll",(req,res)=> {
    res.send("Deleted all data");
})

app.get("/login",(req,res)=> {
    res.send("Login Page");
})

app.use("/",(req,res)=> {
    res.send("Hello from server");
})
app.listen(3000,()=> {
    console.log("Server is listening on port 3000");
});