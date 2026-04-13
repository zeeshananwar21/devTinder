
##authRouter
POST /signUp
POST /login
POST /logout


##ProfileRouter
GET /profile/view
PATCH /profile/edit
PATCH .profile/forgotpassword


##connectionrequestrouter
POST /request/send/:status/:userID
POST /request/review/:status/:requestID

##userRouter
GET /user/requests/received
GET /user/connections
GET /user/feed