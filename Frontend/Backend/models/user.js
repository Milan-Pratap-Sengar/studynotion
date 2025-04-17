const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Student" , "Instructor" , "Admin"]
    },
    active:{
        type:Boolean,
        default:true
    },
    approved:{
        type:Boolean,
        default:true
    },
    additionalDetails :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile",
        required:true
    },
    courses:[ {   //Array
        type:String,
        ref:"course",
    } ],
    image:{
        type:String, // URL of image
        required:true
    },
    courseProgess:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseProgess"
        }
    ],
    // these two entries("token" and "resetPasswordExpires") will be used in reset password controller logic
    // you will get the proper answer of "why we will take these fields?" when you learn about ResetPassword controller(refer handwritten notes)
    token:{
        type:String
    },
    resetPasswordExpires:{  //reset password link expiration time 
        type:Date
    },
},{timestamps:true})

module.exports=mongoose.model("user",userSchema)