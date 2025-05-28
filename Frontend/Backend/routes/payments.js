const express = require("express")
const router = express.Router()

// import payment controllers

const {capturePayment, verifySignature,sendPaymentSuccessEmail}=require("../controllers/payments")

// import all middlewares
const {authMiddleware, isStudentMiddleware, isInstructorMiddleware, isAdminMiddleware}=require("../middlewares/Auth")


// creating routes
router.post("/capturePayment",authMiddleware,isStudentMiddleware,capturePayment)
router.post("/verifySignature",authMiddleware,isStudentMiddleware,verifySignature)
router.post("/sendPaymentSuccessEmail", authMiddleware, isStudentMiddleware, sendPaymentSuccessEmail);


// export the module
module.exports=router