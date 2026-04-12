
##authRouter
POST /signUp
POST /login
POST /logout


##ProfileRouter
GET /profile/view
PATCH /profile/edit
PATCH .profile/forgotpassword


##connectionrequestrouter
POST /request/send/interested/:userID
POST /request/send/ignored/:userID
POST /request/review/accepted
POST /request/review/rejected

##userRouter
GET /user/connections
GET /user/requests
GET /user/feed