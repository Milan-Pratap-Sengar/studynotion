const course = require("../models/course")
const { populate } = require("../models/course")
const profile=require("../models/profile")
const user=require("../models/user")
const {uploadImageToCloudinary}=require("../utils/imageUploader")
require("dotenv").config()
const { convertSecondsToDuration } = require("../utils/secToDuration")
// **********************************************************************************************************************************************************************
//                                                      update profile controller
// **********************************************************************************************************************************************************************


exports.updateProfile=async (req, res)=>{
    try{
        // step 1 : fetch the data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body
        const id=req.user.id
        console.log(id);
        console.log("the data is  "+ dateOfBirth+"   "+about+"   "+contactNumber+"   "+gender)

        // step 2 : validate the data
        if(!id){
            return res.status(400).json({
                success:false,
                message:"User ID not found"
            })
        }

        // step 3 : find profile
        const userDetails=await user.findById(id).populate("additionalDetails").exec()
        console.log("user details are ",userDetails)
        const profileId=userDetails.additionalDetails;
        console.log("profile ID are ",profileId)
        const profileDetails=await profile.findById(profileId)
        console.log("profile details are ",profileDetails)
        // step 4 : update profile
        profileDetails.dateOfBirth=dateOfBirth
        profileDetails.about=about
        profileDetails.contactNumber=contactNumber
        profileDetails.gender=gender

        console.log("The profile details are",profileDetails)
        
        await profileDetails.save();

        // step 5 : return response
        return res.status(200).json({
            success:true,
            updatedUserDetails:userDetails,
            message:"Profile updated successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while updating profile"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                          delete account controller
// **********************************************************************************************************************************************************************


exports.deleteAccount=async (req,res)=>{
    try{
        // step 1 : get user id
        console.log("user Id is:-",req.user)
        const id=req.user.id

        // step 2 : find user details from this id
        const userDetails=await user.findById(id)
        
        // step 3 : validate the user
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        // step 4 : delete profile.  :- in this case, we need to delete user details from both profile.js model as well as user model bcoz if user doesn't exist then there is no point of storing its additional details(in profile.js)
        await profile.findByIdAndDelete({_id:userDetails.additionalDetails})

        // step 5 : remove its entry from the enrolledStudents field


        // step 6 : now delete the user
        await user.findByIdAndDelete({_id:id})

        // step 7 : return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            err:err.message,
            message:"Something went wrong while deleting account.Please try again later"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                          get all user details controller
// **********************************************************************************************************************************************************************

exports.getUserDetails=async(req,res)=>{
    try{
        //  step 1 : fetch the user id
        const id=req.user.id

        // get user details
        const userDetails=await user.findById(id).populate("additionalDetails").exec()

        // return response
        return res.status(200).json({
            success:true,
            userDetails,
            message:"User's details fetched successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while fetching user's all details"
        })
    }
}

// **********************************************************************************************************************************************************************
//                                                          update profile picture controller
// **********************************************************************************************************************************************************************


exports.updateDisplayPicture = async (req, res) => {
    try {
        console.log("helloworld",req.files)
        // step 1 : fetch the user id of which picture is to be updated and the new display picture
        const displayPicture = req.files.displayPicture
        console.log("Display Picture is:-",displayPicture)
        const userId = req.user.id
        console.log(req.user);
        console.log("userId is:-",userId)
        // step 2 : upload the image to the cloudinary
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000)
        console.log("The profile picture is:-",image)

        // step 3 : now, fetch the user and update the profile picture(i.e update profile link) in the database
        const updatedProfile = await user.findByIdAndUpdate({ _id: userId },{ image: image.secure_url },{ new: true })

        console.log("The updatedProfile is:-",updatedProfile)
        // step 4 : send response
        res.status(200).json({
            success: true,
            data: updatedProfile,
            message: `Image Updated successfully`
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            message: `Something went wrong while updating display picture`
        })
    }
};
  

// **********************************************************************************************************************************************************************
//                                                          fetch enrolled courses controller
// **********************************************************************************************************************************************************************


exports.getEnrolledCourses = async (req, res) => {
    try {
        console.log("Enrolled courses are here")
        // step 1 : fetch the user id
        const userId = req.user.id

        // step 2 : fetch all the enrolled courses of this user from database
        const userDetails = await user.findOne({ _id: userId,}).populate({
                                                    path:"courses",
                                                    populate:[
                                                        {
                                                            path:"courseContent",
                                                            populate:{
                                                                path:"subsection"
                                                            },
                                                        },
                                                        {
                                                            path:"instructor"
                                                        }
                                                    ]
                                                    
                                                })
        
        
        // step 3 : validate the user details
        if (!userDetails) {
            return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
            })
        }

        // calculate the durations of the enrolled courses
        const durationsArray=[]
        userDetails.courses.forEach((course)=>{
            let totalDurationInSeconds = 0
            course.courseContent.forEach((section)=>{
                section.subsection.forEach((subsection)=>{
                    const timeDurationInSeconds = parseInt(subsection.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds
                })
            })
            const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
            durationsArray.push(totalDuration)
        })


        const userCourses=userDetails.courses

        // step 4 : send response
        return res.status(200).json({
            success: true,
            data: {
                userCourses,
                durationsArray
            }
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            output: `Something went wrong while fetching all enrolled courses`
        })
    }
};




// **********************************************************************************************************************************************************************
//                                                           controller
// **********************************************************************************************************************************************************************

exports.instructorDashboard=async (req,res)=>{
    try{

        // fetch all the courses of an instructor
        const courseDetails=await course.find({instructor:req.user.id})
        
        const courseData=courseDetails.map((course)=>{
            const totalStudentsEnrolled= course.studentsEnrolled.length
            const totalAmountGenerated=totalStudentsEnrolled*course.price

            // create a new object to store and return all the required data
            const courseDataWithStats={
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats
        })
        res.status(200).json({
            success:true,
            courses:courseData
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Something went wrong while fetching instructor dashboard details"
        })
    }
}