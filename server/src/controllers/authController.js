const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.js");

//register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, targetRole } = req.body;
        //validate input
        if (!name || !email || !password || !targetRole) return res.status(400).json({ message: "All fields are required" });

        //if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already exists" });
        }

        //hash password
        const hashPassword = await bcrypt.hash(password,10);

        //create User
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            targetRole
        });

        res.status(201).json({message:"User Registered Successfully"});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
};

//Login
exports.loginUser = async(req, res)=>{
    try{
        const {email, password} = req.body;

        // validate input
        if(!email || !password){
             return res.status(400).json({message:"Email & Password are required"});
        }

        //check user
        const user = await User.findOne({email});
        if(!user){
             return res.status(401).json({message:"Invalid email or password"});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(401).json({message:"Invalid email or password"});
        }

        // TOKEN create karenge
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn:"7d"});

        res.json({token, 
            user:{
                id:user._id, 
                name: user.name, 
                email: user.email, 
                targetRole: user.targetRole
            }});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
};