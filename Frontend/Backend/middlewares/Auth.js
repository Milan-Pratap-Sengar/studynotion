const jwt=require("jsonwebtoken");
require("dotenv").config()

// middleware for Authentication

exports.authMiddleware=async(req,res,next)=>{
    try{
        // step 1 : extract token from either cookie,body or header
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");
        if(!token){
            return res.status(401).json({
                success: false,
                message:"Token is missing."
            })
        }

        // step 2 : verify the token with jwt secret key
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log("The decoded token is:-",decode)
            // step 3 : store the decoded token in the user's document
            req.user=decode
        }
        catch(err){
            console.log(err);
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"something went wrong while validating the token.Please try again later"
        })
    }
}


// middleware for "student" authorization

exports.isStudentMiddleware=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(200).json({
                success:false,
                message:"You cannot access this Student route"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"something went wrong while student authorization"
        })
    }
}


// middleware for "instructor" authorization

exports.isInstructorMiddleware=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(200).json({
                success:false,
                message:"You cannot access this Instructor route"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"something went wrong while Instructor authorization"
        })
    }
}



// middleware for "admin" authorization

exports.isAdminMiddleware=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(200).json({
                success:true,
                message:"You cannot access this Admin route"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"something went wrong while Admin authorization"
        })
    }
}