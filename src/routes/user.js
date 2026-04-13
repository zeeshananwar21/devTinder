const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

//check all the pending connection for the loggedinuser
userRouter.get('/user/requests/received', userAuth, async(req,res)=> {

    const loggedinuser =req.user;
    const data = await ConnectionRequest.find({
        toUserId: loggedinuser._id,
        //status: 'interested'
    }).populate('fromUserId',['firstName','lastName']);
    res.json({
        message: 'Data Fetched successfully',
        data: data
    })
})

//get all the connections for loggedinuser with accepted status
userRouter.get('/user/connections', userAuth, async(req,res)=> {

    const loggedinuser =req.user;
    const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId: loggedinuser._id, status: 'accepted'},
            {toUserId: loggedinuser._id, status: 'accepted'}
        ]
    }).populate('fromUserId',['firstName','lastName','gender','age'])
    .populate('toUserId',['firstName','lastName','gender','age']);
    const data = connectionRequest.map((row)=> {
        if(row.fromUserId._id.toString()=== loggedinuser._id.toString()) {
            return row.toUserId;
        }
        return row.fromUserId;
    });
    res.json({
        message: 'Data Fetched successfully',
        data: data
    })
})

module.exports = userRouter;