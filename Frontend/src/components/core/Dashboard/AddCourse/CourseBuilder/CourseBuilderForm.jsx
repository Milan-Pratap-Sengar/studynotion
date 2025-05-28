import { set, useForm } from "react-hook-form"
import IconBtn from "../../../../common/IconBtn"
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import toast from "react-hot-toast";
import {updateSection,createSection} from "../../../../../services/operations/CourseDetailsAPI"
import {setStep,setCourse,setEditCourse} from "../../../../../redux/Slices/CourseSlice"
import NestedViewOfSection from "./NestedViewOfSection"

export default function CourseBuilderForm(){

    const {register,handleSubmit,setValue,formState:{errors} }=useForm();
    const [editSectionName,setEditSectionName]=useState(null)
    const {course}=useSelector((state)=>state.course)
    const dispatch=useDispatch();
    const [loading, setLoading]=useState(false)
    const {token}=useSelector((state)=>state.auth)


    const submitHandler=async(data)=>{
        setLoading(true);
        let result;
        if(editSectionName){
            result=await updateSection({sectionName:data.sectionName, sectionId:editSectionName, courseId:course._id},token)
        }
        else{
            // Create section
            result=await createSection({sectionName:data.sectionName, courseId:course._id},token)
        }

        // update values
        if(result){
            dispatch(setCourse(result))
            setEditSectionName(null);
            setValue("sectionName","")
        }
        setLoading(false)
    }

    const cancelEdit=()=>{
        setEditSectionName(null);
        setValue("sectionName","");
    }

    const goBack=()=>{
        dispatch(setStep(1))
        // if you are going back then it means that you have already create a section and now you need to update it
        dispatch(setEditCourse(true))
    }

    const goToNext=()=>{
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section")
            return;
        }
        if(course.courseContent.some((section) => section.subsection.length === 0)){
            toast.error("Please add atleast one lecture in each section")
            return;
        }
        dispatch(setStep(3))
    }

    const handleChangeEditSectionName=(sectionId, sectionName)=>{
        // suppose you already clicked on this edit button, it means editSectionName contains the id of that section whose edit button is clicked..
        // hence if it already contains sectionId,it means you need to reverse the edit...i.e cancel the edit
        if(editSectionName === sectionId){
            cancelEdit()
            return;
        }

        setEditSectionName(sectionId);
        setValue("sectionName",sectionName)
    }

    return(
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                <div>
                    <label className="text-sm text-richblack-5" htmlFor="sectioName"> Section Name  <sup className="text-pink-200">*</sup></label>
                    <input className="form-style w-full" id="sectionName" disabled={loading} placeholder="Add a section to build your course" {...register("sectionName",{required:true})} />
                    {
                        errors.sectionName && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
                        )
                    }
                </div>
                <div className="flex items-end gap-x-4">
                    <IconBtn disabled={loading} type="submit" text={editSectionName ? "Edit Section Name": "Create Section"} outline={true} customClasses={"text-white"}>
                        <IoAddCircleOutline className="text-yellow-50" />
                    </IconBtn>
                    {
                        editSectionName && (
                            <button type="button" className="text-sm text-richblack-300 underline" onClick={cancelEdit}>Cancel Edit</button>
                        )
                    }
                </div>
            </form>

            {
                // Means course has atleast one lecture 
                course?.courseContent?.length > 0 && (<NestedViewOfSection handleChangeEditSectionName={handleChangeEditSectionName}/>)
            }

            <div className="flex justify-end gap-x-3">
                <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>Back</button>
                <IconBtn text={"Next"} onClick={goToNext}>
                    <MdNavigateNext/>
                </IconBtn>
            </div>
        </div>
    )
}