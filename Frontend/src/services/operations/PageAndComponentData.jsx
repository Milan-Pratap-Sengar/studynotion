import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { catalogData } from "../apis"



export const getCatalogPageData=async(catagoryId)=>{
    const toastId=toast.loading("Loading...")
    console.log(catagoryId)
    let result=[]
    try{
        const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{categoryId:catagoryId})
        if(!response?.data?.success){
            throw new Error("Could not fetch Category Page Data")
        }
        console.log("CATALOG PAGE DATA API SUCCESS......",response.data.data)
        result=response?.data

    }
    catch(error){
        console.log("CATALOG PAGE DATA API ERROR.......",error)
        toast.error(error.message)
        result=error?.response?.data
    }
    toast.dismiss(toastId)
    return result
}
