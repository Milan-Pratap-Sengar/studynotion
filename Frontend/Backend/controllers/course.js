const course=require("../models/course")
const category=require("../models/category")
const user=require("../models/user")
const {uploadImageToCloudinary}=require("../utils/imageUploader")
require("dotenv").config()
const section=require("../models/section")
const subsection=require("../models/subsection")
const CourseProgress=require("../models/courseProgess")
const { convertSecondsToDuration } = require("../utils/secToDuration")


// **********************************************************************************************************************************************************************
//                                                          create course controller
// **********************************************************************************************************************************************************************

exports.createCourse=async (req , res)=>{
    try{
        // step 1 : fetch the data and the files from the body
        let {courseName, courseDescription, whatYouWillLearn, price,tag,categoryId,status,instructions:instructions}=req.body
        console.log(courseName, courseDescription, whatYouWillLearn, price, tag,categoryId,status,instructions)
        const thumbnail=req.files.thumbnail

        // Convert the tag and instructions from stringified Array to Array
        // stringified array means the strings that looks like an array but now it is an actual array which can be iterated
        const _tag = JSON.parse(tag)
        const _instructions = JSON.parse(instructions)

        console.log("tag", _tag)
        console.log("instructions", _instructions)

        // step 2 : validate the data
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !_tag.length || !thumbnail || !categoryId || !_instructions.length){
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
        const instructorDetails=await user.findById(userID,{accountType:"Instructor"})
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
        const newCourse=await course.create({
            courseName,
            courseDescription, 
            instructor:instructorDetails._id, 
            whatYouWillLearn : whatYouWillLearn,
            price,
            tag: _tag,
            categoryId:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions :_instructions
        })

        // step 7 : add this new course in the Instructor's taught course list
        await user.findByIdAndUpdate({_id:instructorDetails._id},
                                        {
                                            $push:{courses:newCourse._id}
                                        },
                                        {new:true})
        
        // Add the new course to the Categories
        const categoryDetails2 = await category.findByIdAndUpdate(
          { _id: categoryId },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )

console.log("HEREEEEEEEE", categoryDetails2)

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

// ******************************************************************************************************************************************
//                                                             Edit Course Details
// *******************************************************************************************************************************************

exports.editCourse = async (req, res) => {
  try {
    console.log("hello world    ")
    const { courseId } = req.body
    const updates = req.body
    const Course = await course.findById(courseId)
    console.log(courseId,updates)

    if (!Course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      Course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          Course[key] = JSON.parse(updates[key])
        } else {
          Course[key] = updates[key]
        }
      }
    }

    await Course.save()

    const updatedCourse = await course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
    //   .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec()
      console.log(updatedCourse);
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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


// **********************************************************************************************************************************************************************
//                                                          getFullCourseDetails Controller
// **********************************************************************************************************************************************************************



exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      // .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subsection.forEach((subsection) => {
        const timeDurationInSeconds = parseInt(subsection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// **********************************************************************************************************************************************************************
//                                                          getInstructorCourses Controller
// **********************************************************************************************************************************************************************



exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id

      // Find all courses belonging to the instructor
      const instructorCourses = await course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })

      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } 
    catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}



// **********************************************************************************************************************************************************************
//                                                          deleteCourse Controller
// **********************************************************************************************************************************************************************


exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const Course = await course.findById(courseId)
    if (!Course) {
      return res.status(404).json({ 
        success:false,
        message: "Course not found" 
      })
    }

    // Unenroll students from the course
    const studentsEnrolled = Course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await user.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = Course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const Section = await section.findById(sectionId)
      if (Section) {
        const subSections = Section.subsection
        for (const subSectionId of subSections) {
          await subsection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}