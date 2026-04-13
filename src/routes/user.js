const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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

// get all the feed for the loggedInUser
userRouter.get('/feed',userAuth,async(req,res)=> {

    try{
        //send the feed for the loggedInUser except
        // 1. his own
        // 2. the connection which he sent or received
        // 3. he ignored to other person
        // 4. Already connected with other person
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName");

        const hideUsers = new Set();

        connectionRequest.forEach(req => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        });
        console.log(hideUsers);
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsers)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select("firstName lastName age gender about").limit(limit).skip(skip);
        console.log(users);
        res.json({ message: "Fetched",
            data: users
        });
    }
    catch(err) {
        res.status(400).send('ERROR ' + err.message)
    }
})

module.exports = userRouter;