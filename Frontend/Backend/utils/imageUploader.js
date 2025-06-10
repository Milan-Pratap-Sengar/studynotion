const cloudinary=require("cloudinary").v2

exports.uploadImageToCloudinary=async (file , folder, height, quality)=>{
    try{
        console.log("File is:-",file)
        const options={folder}
        console.log("folder is:-",folder)
        if(height){
            options.height=height
        }
        console.log("height is:-",height)
        if(quality){
            options.quality=quality; 
        }
        console.log("quality is:-",quality)
        options.resource_type="auto"
        console.log("finally")
        return await cloudinary.uploader.upload(file.tempFilePath, options)
    }
    catch(error){
        console.log(error);
    }
}   