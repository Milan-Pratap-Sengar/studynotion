import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchInstructorCourses } from "../../../services/operations/CourseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import { IoAdd } from "react-icons/io5";
import InstructorCourses from "./InstructorCourses/InstructorCourses"

export default function MyCourses(){

    const {token}=useSelector((state)=>state.auth)
    const[courses,setCourses]=useState([])
    const navigate=useNavigate()
    const dispatch=useDispatch();

    useEffect(()=>{
        fetchCourses()
    },[])

    const fetchCourses=async ()=>{
        const result=await fetchInstructorCourses(token);
        if(result){
            setCourses(result)
        }
    }


    return(
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
                <IconBtn text={"Add Course"} onClick={()=>navigate("/dashboard/add-course")}>
                    <IoAdd/>
                </IconBtn>
            </div>
            {
                courses && (<InstructorCourses courses={courses} setCourses={setCourses}/>)
            }
        </div>
    )
}