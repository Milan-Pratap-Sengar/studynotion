const mongoose=require("mongoose");
const subsectionsSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    timeDuration:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    videoURL:{
        type:String
    }
})

module.exports=mongoose.model("subsection",subsectionsSchema)