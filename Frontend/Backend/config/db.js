// It is used to connect Node.js server with MongoDB database using mongoose.


const mongoose=require("mongoose")
require("dotenv").config();

const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
    .then(()=>{console.log("Database is connected successfully")})
    .catch((err)=>{
        console.log(err)
        process.exit(1);
    })
}

module.exports=dbConnect;