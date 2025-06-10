import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import {getFullDetailsOfCourse} from "../services/operations/CourseDetailsAPI"
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../redux/Slices/viewCourseSlice";
import VideoDetailSidebar from "../components/core/ViewCourse/VideoDetailSidebar";
import { Outlet } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

export default function ViewCourse(){

    const[reviewModal,setReviewModal]=useState(false)
    const {courseId}=useParams();
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    
    const setCourseSpecificDetails=async ()=>{
        try{
            const courseData=await getFullDetailsOfCourse(courseId,token)
            console.log(courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setEntireCourseData(courseData.courseDetails))
            dispatch(setCompletedLectures(courseData.completedVideos))
            let lectures=0
            courseData?.courseDetails?.courseContent?.forEach((section)=>{
                lectures+=section.subsection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        }   
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        setCourseSpecificDetails()
    },[])


    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailSidebar setReviewModal={setReviewModal}/>
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet/>
                    </div>
                </div>
            </div>
            {
                reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>
            }
        </>
    )
}