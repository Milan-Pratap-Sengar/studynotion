const mongoose=require("mongoose");
const ratingAndReviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    rating:{
        type:Number,
        required:true 
    },
    review:{
        type:String,
        trim:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
        required:true,
        index:true
    }
})

module.exports=mongoose.model("ratingAndReview",ratingAndReviewSchema)