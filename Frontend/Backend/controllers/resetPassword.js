const user = require("../models/user")
const mailSender = require("../utils/mailSender")
const bcrypt=require("bcrypt")

// **********************************************************************************************************************************************************************
//                          reset Password token/URL : It will generate the Reset Password link URL and send it to user's mail
// **********************************************************************************************************************************************************************

exports.resetPasswordToken=async(req,res,next)=>{
    try{
        // step 1 : fetch the email from the body
        const email=req.body.email

        // step 2 : validate email
        if(!email){
            return res.status(401).json({
                success:false,
                message:"Please enter your email"
            })
        }

        // step 3 : verify user exists or not
        const User=await user.findOne({email})
        if(!User){
            return res.status(401).json({
                success:false,
                message:"Your email is not registered"
            })
        }

        // step 4 : generate token
        const token=crypto.randomUUID()

        // step 5 : update the user by adding token and expiration time
        const updatedDetails=await user.findOneAndUpdate({email:email}, {token:token , resetPasswordExpires:Date.now()+5*60*1000}, {new:true})

        // step 6 : create URL for sending
        const url=`http://localhost:3000/update-password/${token}`

        // step 7 : send email
        await mailSender(email,"Password Reset Link",`Password Reset Link : ${url}`)

        // step 8 : return response
        res.status(200).json({
            success:true,
            message:"Reset Password Link sent successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while sending Reset Password Link"
        })
    }
}

// **********************************************************************************************************************************************************************
//   reset password : This controller will define the logic of actual change in password after clicking on the link sent on user's email
// **********************************************************************************************************************************************************************

exports.resetPassword=async(req,res)=>{
    try{
        // step 1 : fetch data from body
        const {password,confirmPassword,token}=req.body;

        // step 2 : validate the password
        if(!password || ! confirmPassword || !token){
            return res.status(401).json({
                success:false,
                message:"All Fields are required"
            })
        }
        if(password!==confirmPassword){
            return res.status(401).json({
                success:false,
                message:"Password and Confirm Password not Matched"
            })
        }

        // step 3 : fetch the user from the database
        const userDetails=await user.findOne({token:token})

        // step 4 : validate the user and reset password link expiry date
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found/Token is invalid"
            })
        }
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(401).json({
                success:false,
                message:"Token is expired, Please regenerate your token"
            })
        }
        // step 5 : hashed the new password
        const hashedPassword= await bcrypt.hash(password,10)

        // step 6 : update this password in the database
        await user.findOneAndUpdate({token:token},{password:hashedPassword},{new:true})

        // step 7 : return response
        res.status(200).json({
            success:true,
            message:"Password is changed successfully "
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err: err.message,
            message:"Something went wrong during reset password"
        })
    }
}