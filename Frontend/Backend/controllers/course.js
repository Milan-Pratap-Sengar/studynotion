const course=require("../models/course")
const category=require("../models/category")
const user=require("../models/user")
const {uploadImageToCloudinary}=require("../utils/imageUploader")
require("dotenv").config()


// **********************************************************************************************************************************************************************
//                                                          create course controller
// **********************************************************************************************************************************************************************

exports.createCourse=async (req , res)=>{
    try{
        // step 1 : fetch the data and the files from the body
        let {courseName, courseDescription, whatYouWillLearn, price, tag,categoryId,status,instructions}=req.body
        const thumbnail=req.files.thumbnail

        // step 2 : validate the data
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !categoryId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(!status || status===undefined){
            status="Draft"
        }

        // step 3 :It is obvious that if a user create his/her course on the website then he/she must be already logged in and login controller already executed.Therefore, Go in "course" model and you can observe that each course also contains the instructor's object Id. so we can fetch it from JWT token's payload
        const userID=req.user.id; // go in "auth" controller(line: 188), we already stored the user id in the payload
        console.log(userID);
        const instructorDetails=await user.findById(userID,{accountType:"Instructor"})
        console.log(instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found"
            })
        }

        // step 4 : check whether the give tag is correct or not (if the user selects the tag from frontend Dropdown list then it is always valid but if the user give the tag using postman then we need to validate it)
        const categoryDetails=await category.findById(categoryId)
        if(!categoryDetails){
            return res.status(401).json({
                success:false,
                message:"category details not found"
            })
        }

        // step 5 : upload image in cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        // step 6 : create an entry for a new course
        const newCourse=await course.create({courseName, courseDescription, instructor:instructorDetails._id, whatYouWillLearn:whatYouWillLearn,price,tag:tag,category:categoryDetails._id,thumbnail:thumbnailImage.secure_url,status:status,instructions:instructions})

        // step 7 : add this new course in the Instructor's taught course list
        await user.findByIdAndUpdate({_id:instructorDetails._id},
                                        {
                                            $push:{courses:newCourse._id}
                                        },
                                        {new:true})
        
        // step 8 : update the category schema(i.e. add this code in its assigned category list)

        // step 9 : return response
        return res.status(200).json({
            success:true,
            data:newCourse,
            message:"Course created successfully"
        })


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while creating course"
        })
    }
}

// **********************************************************************************************************************************************************************
//                                                          getAllCourses Controller
// **********************************************************************************************************************************************************************

exports.showAllCourses=async (req,res)=>{
    try{
        // step 1 : fetch all courses
        const allCourses=await course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true}).populate("instructor").exec()

        // step 2 : return response
        return res.status(200).json({
            success:true,
            data:allCourses,
            message:"All courses fetched successfully"
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while fetching all the courses"
        })
    }
}



// **********************************************************************************************************************************************************************
//                                                          getCourseDetails Controller
// **********************************************************************************************************************************************************************

exports.getCourseDetails=async (req,res)=>{
    try{
        // step 1 : fetch courseId
        const {courseId}=req.body

        // step 2 : find  course's all details
        const courseDetails=await course.find({_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additionalDetails"
                                                    }
                                                }
                                            )
                                            .populate("categoryId")
                                            // .populate("ratingAndReview")
                                            .populate(
                                                {
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subsection"
                                                    }
                                                }
                                            )
                                            .exec()

        // step 3 : validate course details
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Could not find the course with given Id"
            })
        }

        // step 4 : return response
        return res.status(200).json({
            success:true,
            data:courseDetails,
            message:"All course details fetched successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while fetching course's all details"
        })
    }
} 