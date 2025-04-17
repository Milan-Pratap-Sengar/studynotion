//  The mail purpose of "nodemailer" is to send email from the Node.js server

const nodemailer=require("nodemailer");
require("dotenv").config()
 

//This function is used to send mail to the "email" passed in parameter and the "title" as well as "body" is also passed as a parameter

const mailSender=async(email,title,body)=>{
    try{
        let transporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }

        })

        let info=await transporter.sendMail({
            from:"StudyNotion - by Milan Pratap Sengar",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)
        return info
    }
    catch(err){
        console.log(err.message) 
    }
}
module.exports=mailSender;