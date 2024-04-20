/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    User controller for each route
*/
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async(req, res) =>{
    const{username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        console.log("one ore more fields blank.");
        throw new Error("All fields are required");
    }

    const userUnvailable = await User.findOne({ email });

    if(userUnvailable) {
        console.log("email already in use");
        res.status(400);
        throw new Error("User already registered");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password : "+ hashedPassword);
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user) {
        res.status(201).json({success: true});
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    
}) ;





//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    console.log(email +" "+ password);
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    
    //compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "10m"}
        
        );
        console.log("log in succesful");
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        console.log("failed to log in");
        throw new Error("Unauthorized access. Email or Password is not valid");
    }
}) ;



//@desc Show current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async(req, res) =>{
    res.status(200).json(req.user);
}) ;


module.exports = { registerUser, loginUser, currentUser };
