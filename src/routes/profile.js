const express = require('express');
const { userAuth} = require('../middlewares/auth');
const {validateEditData} = require("../utils/validation");

const ProfileRouter = express.Router();

ProfileRouter.get("/profile/view", userAuth, async (req,res)=> {
    try{
        const user = req.user;
    res.send(user);
    }catch(err) {
        res.status(400).send('Something went wrong' + err.message);
    }

})

ProfileRouter.patch('/profile/edit', userAuth, async(req,res)=> {
    try{
        if(!validateEditData(req)) {
            throw new Error("Profile Edit Not Allowed");
        }
        const LoggedInUser = req.user;
        Object.keys(req.body).forEach(key=> LoggedInUser[key]=req.body[key]);

        await LoggedInUser.save();
        res.json({
            message: `${LoggedInUser.firstName} your profile update successfully`,
            data: LoggedInUser
        })
    }
    catch(err) {
        res.status(400).send('Error' + err.message);
    }
})
module.exports = ProfileRouter;