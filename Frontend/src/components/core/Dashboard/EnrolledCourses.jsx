import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/ProfileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

function EnrolledCourses(){

    const {token}=useSelector((state)=> state.auth)
    const [EnrolledCourses,setEnrolledCourses]=useState(null);
    const navigate=useNavigate()
    const[courseDurations,setCourseDurations]=useState([])


    const getEnrolledCourses= async()=>{
        try{
            
            const response=await getUserEnrolledCourses(token)
            setEnrolledCourses(response)
            setCourseDurations(response?.durationsArray)
        }
        catch{
            console.log("Unable to get Enrolled Courses")
        }
    }

    useEffect(()=>{
        getEnrolledCourses()
    },[])


    
    console.log("The enrolled courses are",EnrolledCourses)
    return(
            <div>
                <div className="text-3xl text-richblack-50">Enrolled Courses</div>
                {
                    ! EnrolledCourses ?
                    (
                        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                            <div className="spinner"></div>
                        </div>
                    ):
                    (
                        EnrolledCourses?.userCourses?.length==0 ?
                        (
                            <div className="grid h-[10vh] w-full place-content-center text-richblack-5">You have not Enrolled in any course yet...</div>
                        ):
                        (
                            <div  className="my-8 text-richblack-5">
                                <div className="flex rounded-t-lg bg-richblack-500 ">
                                    <p className="w-[45%] px-5 py-3">Course Name</p>
                                    <p className="w-1/4 px-2 py-3">Duration</p>
                                    <p className="flex-1 px-2 py-3">Instructor Name</p>
                                </div>

                                    {/* Now display each card */}
                                    {
                                        //  console.log("THE ENROLLED COURSES ARE",EnrolledCourses)
                                        EnrolledCourses?.userCourses?.map((course,index,arr)=>(
                                            <div  
                                                key={index}  
                                                className={`flex items-center cursor-pointer border border-richblack-700 ${index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`}  
                                                onClick={() => {
                                                    navigate(
                                                        `/view-course/${course?._id}/section/${course?.courseContent?.[0]?._id}/sub-section/${course?.courseContent?.[0]?.subsection?.[0]?._id}`
                                                    )
                                                }}>
                                                <div className="flex w-[45%]  items-center gap-4 px-5 py-3">
                                                    <img src={course?.thumbnail} alt="course_img" className="h-14 w-14 rounded-lg object-cover"/>
                                                    <div className="flex max-w-xs flex-col gap-2">
                                                        <p className="font-semibold">{course?.courseName}</p>
                                                        <p className="text-xs text-richblack-300">{course?.courseDescription?.length > 50 ? `${course?.courseDescription?.slice(0, 50)}...`: course?.courseDescription}</p>
                                                    </div>
                                                </div>

                                                <div className="w-1/4 px-6 py-3">{courseDurations?.[index]}</div>

                                                <div className="flex w-1/5 flex-col gap-2 px-6 py-3">
                                                    <p>{course?.instructor?.firstName}{"   "}{course?.instructor?.lastName}</p>
                                                    {/* <ProgressBar completed={course?.progressPercentage || 0} height="8px" isLabelVisible={false} /> */}
                                                </div>
                                            </div>
                                        ))
                                    } 
                            </div>    
                        )
                    )
                }
            </div>
    )
}

export default EnrolledCourses;