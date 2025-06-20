import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../../redux/Slices/CourseSlice";
import {COURSE_STATUS} from "../../../../../utils/Constants"
import { useNavigate } from "react-router-dom";
import { editCourseDetails } from "../../../../../services/operations/CourseDetailsAPI";

export default function PublishCourseForm(){

    const dispatch=useDispatch();
    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const [loading,setLoading]=useState(false)
    const {register,setValue,getValues,handleSubmit}=useForm();
    const navigate=useNavigate();

    useEffect(()=>{
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true)
        }
    },[])

    function goBack(){
        dispatch(setStep(2));
    }

    const submitHandler=()=>{
        handleCoursePublish();
    }

    const goToCourses=()=>{
        dispatch(resetCourseState())
        // navigate("/dashboard/my-courses")
    }

    const handleCoursePublish=async()=>{
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
            // no updation in form.Hence no need to make API call
            goToCourses();
            return;
        } 

        // if form data is updated
        const formData=new FormData()
        formData.append("courseId",course._id)
        const courseStatus=getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
        formData.append("status",courseStatus)

        setLoading(true)
        console.log("before editCourseDetails API")
        const result=await editCourseDetails(formData,token)
        console.log("After editCourseDetails API")
        if(result){
            goToCourses()
        }
        setLoading(false);
    }

    


    return(
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p  className="text-2xl font-semibold text-richblack-5">Publish Course</p>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="my-6 mb-8">
                    <label className="inline-flex items-center text-lg">
                        <input className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5" type="checkbox" id="public" {...register("public")}/>
                        <span className="ml-2 text-richblack-400"> Make this Course as Public</span>
                    </label>
                </div>

                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading} type="button" onClick={goBack} className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900" >
                        Back
                    </button>
                    <IconBtn disabled={loading} text={"Save Changes"}/>
                </div>
            </form>
        </div>
    )
}