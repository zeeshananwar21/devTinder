const express = require('express');
const mongoose = require('mongoose');
const { userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const RequestRouter = express.Router();
RequestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=> {
   try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //CHECK if toUserId is valid or not
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    return res.status(400).json({
        message: "Invalid User ID"
  });
}
    const allowedStatus = ['interested','ignored']

    //check if status are valid
    if(!allowedStatus.includes(status)){
        throw new Error('Invalid status')
    }
    //check if user exist in db
    const user = await User.findOne({ _id: toUserId });
    if(!user){
        return res.status(404).json({
            message: 'User not found',
        })
    }
    //check if user try to send duplicate connection request or if other person send the request
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            { fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
    })
    if(existingConnectionRequest){
        throw new Error('Connection Request Already Exist');
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })
        const data = await connectionRequest.save();
        res.json({
            message: status === 'interested'?`${req.user.firstName} ${status} in ${user.firstName}`:`${req.user.firstName} ${status} ${user.firstName}`,
            data
        })
    console.log('request sent',data);
   }
   catch(err){
    res.status(400).send("ERROR " + err.message);
   }
    
})

module.exports = RequestRouter;