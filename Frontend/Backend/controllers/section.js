const section=require("../models/section")
const course=require("../models/course")

// **********************************************************************************************************************************************************************
//                                                                      create section controller
// **********************************************************************************************************************************************************************


exports.createSection=async (req,res)=>{
    try{
        // step 1 : fetch the data
        const {sectionName, courseId}=req.body // name of the section and course ID of which this section is a part.

        // step 2 : validate the data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : create a section
        const newSection=await section.create({sectionName})

        // step 4 : Now, link/attach this new section with a perticular course of which this section is a part
        const updatedCourseDetails=await course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true})
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subsection"
                                        }
                                    }).exec()

        // step 5 : return response
        return res.status(200).json({
            success:true,
            updatedCourseDetails,
            message:"Section created successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while creating section"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                          update section controller
// **********************************************************************************************************************************************************************

exports.updateSection=async (req,res)=>{
    try{
        // step 1 : fetch new data
        const {sectionName, sectionId}=req.body // new name of the section and the ID of the section whose name is to be updated.

        // step 2 : validate the data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : update a section
        const Section=await section.findByIdAndUpdate(sectionId,{sectionName:sectionName }, {new:true})

        // step 4 : return response
        return res.status(200).json({
            success:true,
            Section ,
            message:"Section updated successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while updating section"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                              delete section controller (completely written by me)
// **********************************************************************************************************************************************************************


exports.deleteSection=async (req,res)=>{
    try{
        // step 1 : fetch the ID of the section you want to delete :- we are assuming that we are sending ID in params(i.e.URL)
        const {courseId,sectionId}=req.params;
        console.log("The course Id and Section Id are:- ",courseId,sectionId)
        // step 2 : validate the input data
        if(!courseId || !sectionId){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        // step 3 : check whether course and section exist or not
        const sectionDetails=await section.findById(sectionId)
        const courseDetails=await course.findById(courseId)
        if(!sectionDetails){
            return res.status(401).json({
                success:false,
                message:"Section does not exist"
            })
        }
        if(!courseDetails){
            return res.status(401).json({
                success:false,
                message:"course does not exist"
            })
        }

        // step 4 : remove/unlink the section from its parent course {do we need to remove it from the course also(i.e unlink/detach it with the course)}
        await course.findByIdAndUpdate(courseId,{$pull:{section:sectionId}})

        // step 2 : delete a section
        await section.findByIdAndDelete(sectionId)
        
        // step 4 : return response
        return res.status(200).json({
            success:true,
            section ,
            message:"Section deleted successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Something went wrong while deleting section"
        })
    }
}