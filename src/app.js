const express = require('express');

const app = express();


app.get("/user",(req,res)=> {
    res.send({name:"Zeshan Anwar",age:"31"});
})
app.use("/",(req,res)=> {
    res.send("Hello from server");
})
app.listen(3000,()=> {
    console.log("Server is listening on port 3000");
});