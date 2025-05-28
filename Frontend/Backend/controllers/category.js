const category=require("../models/category")
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// **********************************************************************************************************************************************************************
//                                                              create category controller
// **********************************************************************************************************************************************************************

exports.createCategory=async(req , res )=>{
    try{
        // step 1 : fetch the name and description of the course from the body
        const {name, description}=req.body

        // step 2 : validate the details
        if(!name){
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
        const allcategories=await category.find({})

        return res.status(200).json({
            success:true,
            // categories:categoriesName,
            categories:allcategories,
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
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: ", categoryId);
        // Get courses for the specified category
        const selectedCategory = await category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec()

        //console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.")
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            })
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await category.find({_id: { $ne: categoryId },})
        let differentCategory = await category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()
            //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}