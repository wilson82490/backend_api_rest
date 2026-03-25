
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) => {
    const token =jwt.sign(
        {id: user._id, email: user.email},
        process.env.JWT_SECRET, 
    {
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
);
    return token;
};

export const profile = async (req, res) => {
   try {
    const user = await User.findById(req.user.id).select("-password");


    res.json({
        message: "This is the profile route",
        user: user,
    });
   } catch (error) {
    res.status(500).json({message: "Internal server error"});
   }
};

export const login = async (req, res) => {

    try {
        const {email, password} = req.body;

    if(!email || !password){
        return res
        .status(400)
        .json({message: "Email and password are required"});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if(!emailRegex.test(email)){
        return res
        .status(400)
        .json({message: "Invalid email format"});
    };

    if(password.length < 6){
        return res
        .status(400)
        .json({message: "Password must be at least 6 characters long"});
    }


    const user = await User.findOne({email});

   if(!user){
    return res.status(400).json({message: "Invalid credentials"});
    
    }
   const isMatch = await bcrypt.compare(password, user.password);

   if(!isMatch){
    return res.status(400).json({message: "Invalid credentials"});
   }

    const token = createToken(user);
    res.json({token});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
    

};


export const register = async (req, res) => {

    try {
        const{email, password} = req.body;

    if(!email || !password){
        return res
        .status(400)
        .json({message: "Email and password are required"});
    }

  /*   if(!email.includes("@")){
        return res
        .status(400)
        .json({message: "Invalid email format"});
    } */

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if(!emailRegex.test(email)){
            return res
            .status(400)
            .json({message: "Invalid email format"});
        };

        if(password.length < 6){
            return res
            .status(400)
            .json({message: "Password must be at least 6 characters long"});
        }


        const existingUser = await User.findOne({email});

        if(existingUser){
            return res
            .status(400)
            .json({message: "Email already in use"});
        }

        

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        email, 
        password: hash,
    });
    

    res.status(201).json({
        id: user._id,
        email: user.email,
    });
    } catch (error) {
        //console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
    
};