require("dotenv").config(); // this packege will help in loading env variables
const express = require("express"); // framework for nodejs
const bodyParser = require('body-parser') // a package which will parse body of reqs so it is available
const app = express(); // initializing app instance
const jwt = require('jsonwebtoken')

app.use(bodyParser.json()); // a middleware for parsing application/json

// this is data, you can assume it to be stored in Database
const todos = [{id:Math.random(),text:"complete udemy course",user:"faizan"},{id:Math.random(),text:"setup node18 on your machine",user:'hamza'}];

// This endpoint will return todos to specific user
// After authenticating that user through token he have
app.get('/todos',authenticateUser,(req,res)=>{
    const userName = req.user.name;
    const filteredTodos = todos.filter(todo=>todo.user===userName)
    res.json(filteredTodos)
})

// This endpoint is used to login user
// And correspondingly by creating jwt for him
app.post('/login',(req,res)=>{
    // Authenticate User
    // Assume that user credentials are correct,
    // And system is going to give him a token, to identify that this user is authienticated, so let him perform actions
    console.log("req.body: ",req.body) // logging to debug application, these logs will be visible only in server where application is hosted
    const userName=req.body.username; // extracting credentials given by user for logging in
    const user = {name:userName};
    console.log("user credentials: ",user) // logging to debug application, these logs will be visible only in server where application is hosted

    // creating jwt token which will be given to user, to identify him for secure apis
    // Now user have to give this token to access endpoints, which are secured
    // How it will work:
    // Actually jwt token is verified through a secret key, the same key which was used to create token
    // And that key is stored securely in .env file or in some secure place
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken})
})

// helper - functions
// This will be used to authenticate user jwt token
// Either token is valid or not
// We can use this middleware for all secure endpoints, to authorize user
function authenticateUser (req,res,next) {
    const token=req.headers.authorization; // extracting token from req headers, provided by user
    if(!token) return res.sendStatus(401); // token don't exist in user request
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        console.log("info: ",err) // logging err for debugging purpose
        if(err) return res.sendStatus(403); // jwt token is not valid, maybe it is expired or not valid
        req.user=user; // we stored user in token, so if verification is successful, we will got our data which was used to make token
        next(); // user is authenticated, now calling next middleware
    })
}


app.listen(3000); // application/server is running on port 3000

// TODO:
// As we are not expiring or refreshing token
// Implement refreshing token, expiring token as well
