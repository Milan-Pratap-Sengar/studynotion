const express=require("express");
const router=express.Router()

// import profile controllers

const {updateProfile, deleteAccount, getUserDetails, updateDisplayPicture, getEnrolledCourses}=require("../controllers/profile");
const { authMiddleware } = require("../middlewares/Auth");

// creating routes

router.delete("/deleteAccount",authMiddleware,deleteAccount)
router.put("/updateProfile",authMiddleware,updateProfile)
router.get("/getUserDetails",authMiddleware,getUserDetails)
router.get("/getEnrolledCourses",authMiddleware,getEnrolledCourses)
router.put("/updateDisplayPicture",authMiddleware,updateDisplayPicture)

// exports
module.exports = router
