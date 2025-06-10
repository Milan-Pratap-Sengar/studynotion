const mongoose=require("mongoose");
const courseProgessSchema=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"subsection"
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
})

module.exports=mongoose.model("courseProgess",courseProgessSchema)