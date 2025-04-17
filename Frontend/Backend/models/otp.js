const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate= require("../mail/templates/emailVerificationTemplate")
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 24*60*60*1000// 5 minutes
    },
    otp:{
        type:String,
        required:true,
    }
})


// nodemailer.createTransport is used to send email and this part of the code will decide that the email will be sent just before creating user's signup details in the database

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse=await mailSender(email,"verification Email from StudyNotion", emailTemplate(otp));
        console.log("Email send successfully :- " , mailResponse.response)
    }
    catch(err){
        console.log("Error Occured while sending Emails :- ",err);
        throw err;
    }
}

OTPSchema.pre("save", async function(next) {
    console.log("New document saved to database")

    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp)
    }
    next();
})

module.exports=mongoose.model("OTP",OTPSchema)