const express = require("express")
const router = express.Router()

// import payment controllers

const {capturePayment, verifySignature}=require("../controllers/payments")

// import all middlewares
const {authMiddleware, isStudentMiddleware, isInstructorMiddleware, isAdminMiddleware}=require("../middlewares/Auth")


// creating routes
router.post("/capturePayment",authMiddleware,isStudentMiddleware,capturePayment)
router.post("/verifySignature",verifySignature)


// export the module
module.exports=router