const mongoose=require("mongoose");
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "course",
            },
    ],
})

module.exports=mongoose.model("category",categorySchema)