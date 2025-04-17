const express=require("express");
const router=express.Router()

// import course controllers

const {createCourse, showAllCourses, getCourseDetails}=require("../controllers/course")
const {createCategory, showAllCategories, categoryPageDetails}=require("../controllers/category")
const {createSection, updateSection, deleteSection}=require("../controllers/section")
const {createSubsection, updateSubsection, deleteSubsection}=require("../controllers/subsection")
const {createRating, getAverageRating, getAllRatings}=require("../controllers/ratingAndReview")

// import the middlewares

const {authMiddleware, isStudentMiddleware, isInstructorMiddleware, isAdminMiddleware}=require("../middlewares/Auth")



// creating routes

// course handler routes
router.post("/createCourse",authMiddleware,isInstructorMiddleware,createCourse)
router.get("/getAllCourses",showAllCourses)
router.get("/getCourseDetails",getCourseDetails)

// section handler routes
router.post("/addSection",authMiddleware,isInstructorMiddleware,createSection)
router.post("/updateSection",authMiddleware,isInstructorMiddleware,updateSection)
router.post("/deleteSection",authMiddleware,isInstructorMiddleware,deleteSection)
// subsection handler routes
router.post("/addSubsection",authMiddleware,isInstructorMiddleware,createSubsection)
router.post("/updateSubsection",authMiddleware,isInstructorMiddleware,updateSubsection)
router.post("/deleteSubsection",authMiddleware,isInstructorMiddleware,deleteSubsection)
// category handler routes (only accessed by admin)
router.post("/createCategory",authMiddleware,isAdminMiddleware,createCategory)
router.get("/showAllCategories",showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)
// rating and review handler routes
router.post("/createRating",authMiddleware,isStudentMiddleware,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRatings)


module.exports=router;