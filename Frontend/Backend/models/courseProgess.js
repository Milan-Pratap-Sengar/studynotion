const mongoose=require("mongoose");
const courseProgessSchema=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"subsections"
        }
    ]
})

module.exports=mongoose.model("courseProgess",courseProgessSchema)