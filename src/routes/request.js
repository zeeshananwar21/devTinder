const express = require('express');
const { userAuth} = require('../middlewares/auth');

const RequestRouter = express.Router();
RequestRouter.post('/sendconnectionrequest',userAuth,async(req,res)=> {
    const user = req.user;
    res.send(user.firstName + ' sent connection request');
    console.log('request sent');
})

module.exports = RequestRouter;