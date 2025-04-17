const category=require("../models/category")

// **********************************************************************************************************************************************************************
//                                                              create category controller
// **********************************************************************************************************************************************************************

exports.createCategory=async(req , res )=>{
    try{
        // step 1 : fetch the name and description of the course from the body
        const {name, description}=req.body

        // step 2 : validate the details
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All Fields Are Required"
            })
        }

        // step 3 : create entry in database
        const categoryDetails=await category.create({
            name: name,
            description:description
        })

        // return response
        return res.status(200).json({
            success:true,
            message:"category Created Successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err: err.message,
            message:"Something went wrong while creating category"
        })
    }
}

// **********************************************************************************************************************************************************************
//                                                              getAllcategories controller
// **********************************************************************************************************************************************************************

exports.showAllCategories=async(req ,res)=>{
    try{
        const allcategories=await category.find({},{name:true, description:true})
        return res.status(200).json({
            success:true,
            categorys:allcategories,
            message:"All categories are fetched successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err: err.message,
            message:"Something went wrong while fetching all category"
        })
    }
}


// **********************************************************************************************************************************************************************
//                                                              categoryPageDetails controller
// **********************************************************************************************************************************************************************

// this controller suggests other courses of same category along with some different category.This part can be flexible.you can add/remove some steps
exports.categoryPageDetails=async(req,res)=>{
    try{
        // step 1 : get categoryId
        const {categoryId}=req.body

        // step 2 : fetch courses for this Id
        const selectedCategory=await category.findById(categoryId).populate("courses").exec()

        // step 3 : validate the data for this category
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found for this category"
            })
        }

        // step 4 : get courses for different category
        const differentCategory=await category.find({_id:{$ne:categoryId}}).populate("courses").exec() // $ne means "not equals"

        // step 5 : get top selling course

        // step 6 : return response
        res.status(200).json({
            success:true,
            data:{
                selectedCategory:selectedCategory,
                DifferentCategory:differentCategory 
            },
            message:"Courses suggestion details fetched successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            err: err.message,
            message:"Something went wrong while fetching suggestions "
        })
    }
}