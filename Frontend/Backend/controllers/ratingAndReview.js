const ratingAndReview=require("../models/ratingAndReview")
const course=require("../models/course")
const { default: mongoose } = require("mongoose")


// **********************************************************************************************************************************************************************
//                                                          create Rating controller
// **********************************************************************************************************************************************************************

exports.createRating=async (req, res)=>{
    try{
        //  step 1 : fetch userId, courseId, rating and review
        const {courseId,rating,review}=req.body
        const userId=req.user.id

        // step 2 check user enrolled or not  {Another way is explained in notes to check the existance of some value}

        // way 1 :
        const courseDetails=await course.findOne({_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}},})
                   if(!courseDetails){
                    return res.status(400).json({
                        success:false,
                        message:"Student is not enrolled in the course"
                    })
                   }

        // way 2 :
        // const courseDetails=await course.findOne({_id:courseId})
        // if(!courseDetails){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Course not found"
        //     })
        // }
        // if(!courseDetails.studentsEnrolled.includes(userId)){
        //     return res.status(401).json({
        //         success:false,
        //         message:"Student is not enrolled in the course"
        //     })
        // }

        // step 3 : validate that user already reviewed or not
        const alreadyReviewed=await ratingAndReview.findOne({
                                                                user:userId,
                                                                course:courseId
                                                            })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"User already reviewed this course"
            })
        }

        // step 4 : creating rating and review
        const ratingReview=await ratingAndReview.create({user:userId,rating:rating,review:review,course:courseId})

        // step 5 : now update/attach this rating with the course
        const updatedCourseDetails=await course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReviews:ratingReview._id}},{new:true}) 

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating Rating"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                          get average Rating controller
// **********************************************************************************************************************************************************************

exports.getAverageRating=async(req,res)=>{
    try{
        // step 1 : fetch courseId
        const courseId=req.body;

        // step 2 : calculate average rating
        const result=await ratingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        // step 3 : return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        else{
            // no user rated yet
            return res.status(200).json({
                success:true,
                averageRating:0,
                message:"No user rating for this course yet"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while getting average Rating"
        })
    }
}




// **********************************************************************************************************************************************************************
//                                                          get all users Rating for all courses controller
// **********************************************************************************************************************************************************************

exports.getAllRatings=async(req,res)=>{
    try{
        // fetch all ratings and return response
        const allReviews=await ratingAndReview.find({}).sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image" //populated fields
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec()
        
        return res.status(200).json({
            success:true,
            data:allReviews,
            message:'All ratings are fetched successfully'
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching all Ratings"
        })
    }
}