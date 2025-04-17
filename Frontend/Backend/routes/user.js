const express=require("express");
const router=express.Router()

// import user controllers
const {login, signUp, sendOtp, changePassword}=require("../controllers/auth")
const {resetPasswordToken, resetPassword}=require("../controllers/resetPassword")

// import middleware
const {authMiddleware}=require("../middlewares/Auth")

// creating routes

// Authentication routes
router.post("/signup",signUp)
router.post("/login",login)
router.post("/sendOtp",sendOtp)
router.post("/changePassword",authMiddleware, changePassword)

// reset password routes
router.post("/reset-password-token",resetPasswordToken)
router.post("/reset-password",resetPassword)


// exports
module.exports = router