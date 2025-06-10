const express=require("express");
const router=express.Router()

// import profile controllers

const {updateProfile, deleteAccount, getUserDetails, updateDisplayPicture, getEnrolledCourses, instructorDashboard}=require("../controllers/profile");
const { authMiddleware, isInstructorMiddleware } = require("../middlewares/Auth");

// creating routes

router.delete("/deleteAccount",authMiddleware,deleteAccount)
router.put("/updateProfile",authMiddleware,updateProfile)
router.get("/getUserDetails",authMiddleware,getUserDetails)
router.get("/getEnrolledCourses",authMiddleware,getEnrolledCourses)
router.put("/updateDisplayPicture",authMiddleware,updateDisplayPicture)
router.get("/instructorDashboard",authMiddleware,isInstructorMiddleware,instructorDashboard)

// exports
module.exports = router
