// Import models and packages
const mailSender = require("../utils/mailSender");
const OTP=require("../models/otp")
const user=require("../models/user")
const otpGenerator=require("otp-generator") // this package is used to generate OTPs.
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const profile = require("../models/profile");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

 
// Controllers

// **********************************************************************************************************************************************************************
//                                              send OTP : This controller will generate the unique otp
// **********************************************************************************************************************************************************************

exports.sendOtp=async (req , res)=>{
    try{
        // step 1 : fetch the email from the body to which the otp needs to be sent
        const {email}=req.body;
        console.log(email);
        // step 2 : check user already exists or not. (As this OTP is used to signup new User .Therefore, the user must not be exists)
        const checkUserPresent=await user.findOne({email})
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Registered. "
            })
        }
        // step 3 : generate OTP
        var otp=otpGenerator.generate(6,{   // here 6 is the length of OTP
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false, // means Don't include it
            specialChars:false
        })
        console.log(otp);

        // step 4 : check whether OTP is unique or not(It means that whether the OTP already exists in someone's database or not because OTP exists for 5 minutes in new users' database as we written in our model)
        // the logic of this step is very brute/poor. In the industries, we will use such libraries which will always generate unique OTPs. we will never use loops while interacting with DB
        let result=await OTP.findOne({otp:otp})
            //generate new OTP until unique one will generate
        
        while(result){
            otp=otpGenerator.generate(6,{  
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp})
        }
        console.log(result);

        // step 5 : create an entry for OTP
        const otpPayload={email,otp}
        console.log(otpPayload)
        const otpBody=await OTP.create(otpPayload)

        // step 6 : send response
        res.status(200).json({
            success:true,
            message:"OTP sent Successfully"
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err:err.message,
            message:"Error Occured while sending OTP"
        })
    }
}




// **********************************************************************************************************************************************************************
//                                                              signup
// **********************************************************************************************************************************************************************

exports.signUp=async (req , res)=>{
    try{
        // step 1 : fetch the data from the body
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber , otp}=req.body;
        console.log("The otp is:-",otp);

        // step 2 : validate the input data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All Fields Are Required" 
            })
        }

        // step 3 : match password and confirm password
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password value does not Matched"
            })
        }
        // step 4 : validate the existence of the user
        const existingUser=await user.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered."
            })
        }
        console.log("existing user is:-",existingUser);

        // step 5 : find most recent Generated password for the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("The recent Otp and otp are:- ",recentOtp,otp);

        // step 6 : verify input OTP and this DB saved OTP
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"OTP not Matched.Please try again"
            })
        }

        // step 7 : if matched, hashed the user's password
        const hashedPassword=await bcrypt.hash(password,10)
        console.log("hashed password is:-",hashedPassword)

        // step 8 : 
        let approved=""
        approved==="Instructor" ? (approved=false):(approved=true)

        // step 9 : create an entry in the database
            // you can add them up later
        const profileDetails=await profile.create({
            gender:null,
            dateOfBirth:null,
            contactNumber:null,
            about:null
        })
        console.log("profile Details is:-",profileDetails)
        const User=await user.create(
            {firstName, lastName, email, contactNumber, password:hashedPassword, accountType:accountType, approved:approved,additionalDetails:profileDetails._id ,
                image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` // this is the third party web API which will generate the image of name Initials.
            }
        )

        // step 9 : return response
        res.status(200).json({
            success:true,
            User,
            message:"User is Registered Successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err:err.message,
            message:"User cannot registered.Please try again later"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                                  login
// **********************************************************************************************************************************************************************

exports.login=async (req,res)=>{
    try{
        // step 1 : fetch the data from the body
        const {email,password}=req.body;

        // step 2 : validate the data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : validate user exist or not
        let User=await user.findOne({email})
        if(!User){
            return res.status(401).json({
                success:false,
                message:"User is not registered.Please signup first"
            })
        }

        // step 4 : if yes, match the password  :- "await bcrypt.compare(password,User.password)"
        // step 5 : generate JWT token
        if(await bcrypt.compare(password,User.password)){
            const payload={
                email:User.email,
                id:User._id,
                accountType:User.accountType
            }
            console.log("The payload is:-",payload);
            const token=jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"})
            User=User.toObject()
            User.token=token
            User.password=undefined

            // step 6 : create cookie and send response
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                User,
                message:"User login Successfully"
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Password is not matched.Please try again"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err:err.message,
            message:"User cannot login.Please try again later"
        })
    }
}


// **********************************************************************************************************************************************************************
//                      change password (This code might contain some error because this code is completely generated by me)
// **********************************************************************************************************************************************************************

exports.changePassword=async (req,res)=>{
   try{
        // step 1 : fetch data from body
        const {oldPassword, newPassword}=req.body;
        console.log("The old password is   "+oldPassword  )
        console.log("The new password is   "+newPassword)
        const User=await user.findById(req.user.id);
        // step 2 : validate the input data
        if(!oldPassword || !newPassword ){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(! await bcrypt.compare(oldPassword,User.password)){  // here the format should be bcrypt.compare(plainTextPassword,hashedPassword)
            return res.status(400).json({
                success:false,
                message:"Please enter the correct Password"
            })
        }
        
        // step 3 : Hash the new password and update password in database
        const hashedPassword=await bcrypt.hash(newPassword,10)
        const updatedUserDetails=await user.findByIdAndUpdate(req.user.id,{password:hashedPassword},{new:true});

        // step 4 : send Email- password change successfully
        try{
			const emailResponse = await mailSender(
				updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
				passwordUpdated(
					updatedUserDetails.email,
					`${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}
        
        // step 5 : return response
        res.status(200).json({
            success:true,
            message:"Password has changed successfully"
        })
   }
   catch(err){
    console.log(err);
        res.status(500).json({
            success:false,
            err:err.message,
            message:"User cannot login.Please try again later"
        })
   }
}