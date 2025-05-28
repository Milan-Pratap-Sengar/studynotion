const {instance}=require("../config/razorpay")
const course=require("../models/course")
const user=require("../models/user")
const mailSender=require("../utils/mailSender")
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const { default: mongoose, setDriver } = require("mongoose")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const crypto = require("crypto");

// You need to follow the razorpay documentation because multiple things are based on documentation in both frontend and backend


// ************************************************************************************************************************************************
//                                                          capture payment controller
// *************************************************************************************************************************************************

exports.capturePayment=async(req,res)=>{

    // step 1 : fetch the course id for which you want to make payment and user id who made the payment
    const {courses}=req.body;
    const userId=req.user.id

    // step 2 : validate the data
    if(courses.length === 0 ){
        return res.status(401).json({
            success:false,
            message:"Please provide atleast one Course Id"
        })
    }

    if(!userId){
        return res.status(401).json({
            success:false,
            message:"User not Found"
        })
    }

    let totalAmount=0;

    // step 3: Find total amount of all selected courses
    for(const course_id of courses ){
        let Course;
        try{
            Course=await course.findById(course_id)
            if(!Course){
                return res.status(401).json({
                    success:false,
                    message:"Could not find the course"
                })
            }

            // validating the user already paid for the same course
            const uid=new mongoose.Types.ObjectId(userId)
            if(Course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"Student is already Enrolled"
                })
            }

            totalAmount+=Course.price
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                err:error.message,
                message:"Something went wrong while calculating total Amount"
            })
        }
    }

    const options={
        amount:totalAmount*100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()
    }

    try{
        const paymentResponse=await instance.orders.create(options)
        return res.status(200).json({
            success:true,
            message:paymentResponse,
            output:"Order created successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Could not initiate Order"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                  verify signature of razorpay and server for authorization
// **********************************************************************************************************************************************************************

const enrollStudentInCourses=async(courses,userId,res)=>{
    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide both courseId and userId "
        })
    }

    for(const course_id of courses){
        try{
            // add the userId to currently enrolled course....As each course consist an array of all students who enrolled in it
            const enrolledCourse=await course.findOneAndUpdate(
                {_id:course_id},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )
            if(!enrolledCourse){
                return res.status(400).json({
                    success:false,
                    message:"Course not Found"
                })
            }

            //find the student and add the course to their list of enrolledCOurses
            const enrolledStudent =await user.findByIdAndUpdate(userId,{$push:{courses:course_id}},{new:true})

            // now send the confirmation mail to the student
            const emailResponse=await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
            )
            console.log("Email sent successfully",emailResponse.response)
        }
        catch(err){
            console.log(err)
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
    }
}



exports.verifySignature=async (req,res)=>{
    try{
        
        // fetch the data
        const razorpay_order_id=req.body?.razorpay_order_id
        const razorpay_payment_id=req.body?.razorpay_payment_id
        const razorpay_signature=req.body?.razorpay_signature
        const courses=req.body?.courses
        const userId=req.user.id 

        // validate the data
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
            return res.status(400).json({
                success: false,
                message:"All fields are required"
            })
        }

        // fixed syntax and format to verify the signature
        const body=razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex")

        if(expectedSignature === razorpay_signature ){
            // As payment is verified.Now, Enroll the student in the courses

            await enrollStudentInCourses(courses,userId,res);

            return res.status(200).json({
                success:true,
                message:"Payment verified"
            })
        }
        
        return res.status(400).json({
            success:false,
            message:"Payment failed"
        })


        
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while verifying signature"
        })
    }
}



// *****************************************************************************************************************************************************
//                                                      Send payment success email
// *****************************************************************************************************************************************************

exports.sendPaymentSuccessEmail=async(req,res)=>{
    try{
        const {orderId,paymentId,amount}=req.body
        const userId=req.user.id

        if(!orderId || !paymentId || !amount || !userId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const enrolledStudent=await user.findById(userId)
        await mailSender(enrolledStudent.email,"Payment Received",paymentSuccessEmail(`${enrolledStudent.firstName} ${enrolledStudent.lastName}` , amount/100,orderId,paymentId))
        return res.status(200).json({
            success:true,
            message:"Payment success Email sent successfully"
        })
    }   
    catch(err){
        console.log("Error in sending Email",err.message)
        return res.status(500).json({
            success:false,
            message:"Could not send Email"
        })
    }
}



//                      {*******************THIS CODE IS VALID FOR ONLY SINGLE PURCHASE****************************}

// **********************************************************************************************************************************************************************
//                                                  capture payment controller
// **********************************************************************************************************************************************************************
// 
// exports.capturePayment=async(req,res)=>{
//     try{
//         // step 1 : fetch the course id for which you want to make payment and user id who made the payment
//         const {course_id}=req.body;
//         const userId=req.user.id
// 
//         // step 2 : validate the data
//             // step 2.1 : validating course
//             if(!course_id){
//                 return res.status(401).json({
//                     success:false,
//                     message:"Please provide course ID"
//                 })
//             }
// 
//             // step 2.2 : validating course Details
//             let currentCourse;
//             try{
//                 currentCourse=await course.findById(course_id)
//                 if(!currentCourse){
//                     return res.status(401).json({
//                         success:false,
//                         message:"Could not find the course" 
//                     })
//                 }
// 
//                 // step 2.3 : validating the user already paid for the same course
//                 const uid= new mongoose.Types.ObjectId(userId) //we have userID as a string but course.enrolledStudents model contains the objectID.so,we need to convert it first
//                 if(currentCourse.studentsEnrolled.includes(uid)){
//                     return res.status(200).json({
//                         success:false,
//                         message:"User already enrolled in this course"
//                     })
//                 } 
//             }
//             catch(err){
//                 console.log(err)
//                 return res.status(500).json({
//                     success:false,
//                     err:err.message,
//                     message:"Something went wrong while validating course data or user data "
//                 })
//             }
// 
//         // step 3 : create an order
//         const amount=currentCourse.price;
//         const currency="INR"
//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:course_id,
//                 userId
//             }
//         }
// 
//         try{
//             const paymentResponse=await instance.orders.create(options)
//             console.log(paymentResponse);
//         }
//         catch(err){
//             console.log(err)
//             return res.status(500).json({
//                 success:false,
//                 err:err.message,
//                 message:"Something went wrong while creating an order"
//             })
//         }
// 
//         // step 4 : return response
//         return res.status(200).json({
//             succes:true,
//             course:currentCourse.courseName,
//             courseDescription:currentCourse.courseDescription,
//             thumbnail:currentCourse.thumbnail,
//             orderID:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//             message:"Order created successfully"
//         })
// 
//     }
//     catch(err){
//         console.log(err)
//         return res.status(500).json({
//             succes:false,
//             err:err.message,
//             message:"Something went wrong while capturing payment"
//         })
//     }
// }
// 
// 
// 
// **********************************************************************************************************************************************************************
//                                                  verify signature of razorpay and server for authorization
// **********************************************************************************************************************************************************************
// 
// exports.verifySignature=async (req,res)=>{
//     try{
//         // step 1 : define a signature secret key of a server
//         const webhookSecret="12345678"
// 
//         // step 2 : fetch the signature secret key from razorpay
//         const signature=req.headers["x-razorpay-signature"] // fixed syntax
// 
//         // step 3 : convert webhookSecret key in signature format .    {video 5 [01:07:00]}
//         const SHAsum=crypto.createHmac("sha256",webhookSecret)
//         SHAsum.update(JSON.stringify(req.body))
//         const digest=SHAsum.digest("hex")
// 
//         if(signature===digest){
//             console.log("Payment is Authorised")
// 
//             // step 4 : As payment has done by the user.Now, Enroll the student in the course
//             // first of all, we need userID and courseID.This time, the data does not come from request body bcoz payment procedure has done by razorpay.So, razorpay hits an API route for a webhook...now see line 63-65, we already added userID and courseID in the notes.So we will fetch it from here
// 
//             const {courseId,userId}=req.body.payload.payment.entity.notes //it is the path where notes are stored.
// 
//             try{
//                 // step 4.1 : add the current user in "enrolledStudents" field of this course model {i.e number of students enrolled in this course}
//                 const enrolledCourse=await course.findOneAndUpdate({_id:courseId},
//                                                                     {$push:{studentsEnrolled:userId}},
//                                                                     {new:true}
//                 )
// 
//                 if(!enrolledCourse){
//                     return res.status(401).json({
//                         succes:false,
//                         message:"Course not found"
//                     })
//                 }
// 
//                 // step 4.2 : now, add this course in the "courses" field of current user's model {i.e. how many courses enrolled by the current user}
//                 const enrolledStud=await user.findOneAndUpdate({_id:userId},
//                                                                 {$push:{courses:courseId}},
//                                                             {new:true}
//                 )
// 
//                 // step 5 : send enrolled course confirmation mail to the user
//                 const emailResponse=await mailSender(enrolledStud.email,"Congratulations from StudyNotion","Congratulations for enrolling in the course")
// 
//                 // step 6 : return response
//                 return res.status(200).json({
//                     succes:true,
//                     message:"Signature verified and course added"
//                 })
//             }
//             catch(err){
//                 console.log(err)
//                 return res.status(500).json({
//                     succes:false,
//                     err:err.message,
//                     message:"Something went wrong while enrolling course"
//                 })
//             }
//         }
//         else{
//             return res.status(401).json({
//                 succes:false,
//                 message:"Invalid request"
//             })
//         }
//     }
//     catch(err){
//         console.log(err)
//         return res.status(500).json({
//             success:false,
//             err:err.message,
//             message:"Something went wrong while verifying signature"
//         })
//     }
// }