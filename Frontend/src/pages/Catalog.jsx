import { useParams } from "react-router-dom"
import Footer from "../components/common/Footer"
import { useEffect, useState } from "react"
import { categories } from "../services/apis"
import { apiConnector } from "../services/apiConnector"
import { getCatalogPageData } from "../services/operations/PageAndComponentData"
import Course_Card from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/CourseSlider"
import { useSelector } from "react-redux"
import Error from "./Error"


export default function Catalog(){

    const {loading}=useSelector((state)=>state.profile)
    const {catalogName}=useParams() //catelogName means categoryName (like AI,ML,Android etc)
    const [catalogPageData,setCatalogPageData]=useState(null)
    const [categoryId,setCatagoryId]=useState("")
    const [active,setActive]=useState(1)

    // to fetch the Id of clicked category/catalog
    const getCategories=async()=>{
        const response=await apiConnector("GET",categories.CATEGORIES_API)
        console.log("GET CATEGORIES RESPONSE......",response.data)
        console.log(catalogName)
        const category_Id=response?.data?.categories.filter((category)=>category.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id
        setCatagoryId(category_Id)
    }

    useEffect(()=>{
        getCategories();
    },[catalogName])

    // to fetch the complete page details of that fetched categoryId
    const getCategoryDetails=async()=>{
        try{
            const response=await getCatalogPageData(categoryId)
            console.log("here is the response",response)
            setCatalogPageData(response)
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        if(categoryId){
            getCategoryDetails()
        }
    },[categoryId])

    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

      if (!loading && !catalogPageData.success) {
        return <Error />
      }


    return (
        <div>
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">Home / Catalog / <span className="text-yellow-25">{catalogPageData?.data?.selectedCategory?.name}</span> </p>
                    <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
                    <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
                </div>
            </div>

            {/* section-1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p className={`px-4 py-2 ${active === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50" } cursor-pointer`}   onClick={() => setActive(1)}>
                        Most Populer
                    </p>
                    <p className={`px-4 py-2 ${ active === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"} cursor-pointer`} onClick={() => setActive(2)}>
                        New
                    </p>
                </div>
                <div> 
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
                </div>
            </div>

                {/* section-2 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                    <div className="py-8"> 
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                    </div>
                </div>

                {/* section-3 */}
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Frequently Bought</div>
                    <div className="py-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {
                                // catalogPageData && 
                                catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>(
                                    <Course_Card course={course} key={index} height={"h-[400px]"}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            <Footer/>
        </div>
    )
}