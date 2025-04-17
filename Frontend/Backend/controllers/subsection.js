const subsection=require("../models/subsection")
const section=require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { default: mongoose } = require("mongoose");
require("dotenv").config();



// **********************************************************************************************************************************************************************
//                                                      create subsection controller
// **********************************************************************************************************************************************************************

exports.createSubsection=async(req,res)=>{
    try{
        // step 1 : fetch the required data for subsection
        const {title, description, sectionId}=req.body;
        const video=req.files.videoFile

        // step 2 : validate the data
        if(!title || !description || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : upload video to the cloudinary
        const uploadDetails=await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        console.log(uploadDetails)

        // step 4 : create a subsection
        const subsectionDetails=await subsection.create({title:title, description:description, timeDuration:`${uploadDetails.duration}`, videoURL:uploadDetails.secure_url})

        // step 5 : link this subsection to its parent section
        const updatedSection=await section.findByIdAndUpdate(sectionId,{$push:{subsection:subsectionDetails._id}},{new:true}).populate("subsection")

        // step 6 : return response
        return res.status(200).json({
            success:true,
            updatedSection,
            message:"Subsection created successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while creating subsection"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                          update subsection controller
// **********************************************************************************************************************************************************************

exports.updateSubsection=async (req,res)=>{
    try{
        // step 1 : fetch the subsection ID whose data to be updated along with new data
        const {subsectionId,title,description}=req.body;
        const Subsection=await subsection.findById(subsectionId)

        // step 2 : validate the data
        if(!Subsection){
            return res.status(404).json({
                success:"false",
                message:"Subsection not found"
            })
        }
        if(title!==undefined){
            // it means there is some value exist in title
            Subsection.title=title;
        }
        if(description!==undefined){
            Subsection.description=description;
        }
        if(req.files && req.files.videoFile !==undefined){
            const video=req.files.videoFile
            const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
            Subsection.videoURL=uploadDetails.secure_url
            Subsection.timeDuration=`${uploadDetails.duration}`
        }

        // step 3 : update the subsection
        await Subsection.save()

        // step 4 : return response
        return res.status(200).json({
            success:true,
            message:"subsection has updated successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while updating subsection"
        })
    }
}



// **********************************************************************************************************************************************************************
//                                                          delete subsection controller
// **********************************************************************************************************************************************************************

exports.deleteSubsection=async (req,res)=>{
    try{
        // step 1 : fetch the id of the subsection to be deleted
        const {subsectionId, sectionId}=req.body
        
        // step 2 : validate the input data
        if(!subsectionId || !sectionId){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : check whether section and subsection exist or not
        const sectionDetails=await section.findById(sectionId)
        const subsectionDetails=await subsection.findById(subsectionId);
        if(!sectionDetails){
            return res.status(401).json({
                success:false,
                message:"Section does not exist"
            })
        }
        if(!subsectionDetails){
            return res.status(401).json({
                success:false,
                message:"Subsection does not exist"
            })
        }

        // // step 4 : remove/unlink the subsection from its parent section
        await section.findByIdAndUpdate(sectionId,{$pull:{subsection:subsectionId}})

        // // step 5 : delete the subsection from DB        
        await subsection.findByIdAndDelete(subsectionId)

        // // step 6 : return response
        return res.status(200).json({
            success:true,
            message:"Subsection has deleted successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while deleting subsection"
        })
    }
}