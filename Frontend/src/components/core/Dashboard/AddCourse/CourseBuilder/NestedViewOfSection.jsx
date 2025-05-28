import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidDownArrow } from "react-icons/bi";
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from "./SubSectionModal";
import {deleteSection, deleteSubSection} from "../../../../../services/operations/CourseDetailsAPI"
import {setCourse} from "../../../../../redux/Slices/CourseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"

export default function NestedViewOfSection({handleChangeEditSectionName}){

    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();

    const [addSubsection,setAddSubsection]=useState(null);
    const [viewSubsection,setViewSubsection]=useState(null);
    const [editSubsection,setEditSubsection]=useState(null);
    const [confirmationModal,setConfirmationModal]=useState(null);
    
    const handleDeleteSection= async(sectionId)=>{
        console.log("Before Delete")
        const result=await deleteSection({sectionId,courseId:course._id},token)
        console.log("After Delete", result)
        if(result){
            dispatch(setCourse(result));
        }
        setConfirmationModal(null)
    }

    const handleDeleteSubSection=async (subsectionId,sectionId)=>{
        console.log("Before Delete",subsectionId,sectionId)
        const result=await deleteSubSection({subsectionId,sectionId},token)
        console.log("After Delete", result)
        if(result){
            const updatedCourseContent=course.courseContent.map((section)=>(
                section._id===sectionId ? result : section
            ))
            const updatedCourse={...course,courseContent:updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
    }


    return(
        <div>
            <div className="rounded-lg bg-richblack-700 p-6 px-8">
                {
                    course?.courseContent.map((section)=>(
                        <details key={section._id} open>
                            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                                <div className='flex items-center gap-x-3'>
                                    <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                    <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                                </div>

                                <div className=' flex items-center gap-x-3'>
                                    <button onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                                        <MdModeEdit className="text-xl text-richblack-300"/>
                                    </button>
                                    <button onClick={()=>(
                                        setConfirmationModal({
                                            text1:"Delete this Section",
                                            text2:"All the lectures in this section will be deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:()=>handleDeleteSection(section._id),
                                            btn2Handler: ()=>setConfirmationModal(null)
                                        })
                                    )}>
                                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>
                                    <span className="font-medium text-richblack-300">|</span>
                                    <BiSolidDownArrow className={`text-xl text-richblack-300`}/>
                                </div>
                            </summary>

                            {
                                console.log(section)
                            }
                            <div className="px-6 pb-4">
                                {
                                    
                                    section?.subsection?.map((data)=>(
                                        <div className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2" key={data?._id} onClick={()=>setViewSubsection(data)}>
                                            <div className='flex items-center gap-x-3 py-2 '>
                                                <RxDropdownMenu className="text-2xl text-richblack-50"/>
                                                <p>{data.title}</p>
                                            </div>
                                            
                                            <div onClick={(e)=>e.stopPropagation()} className="flex items-center gap-x-3">
                                                <button onClick={()=>setEditSubsection({...data,sectionId:section._id})}>
                                                    <MdModeEdit className="text-xl text-richblack-300" />
                                                </button>

                                                <button onClick={()=>(
                                                    setConfirmationModal({
                                                        text1:"Delete this subsection",
                                                        text2:"Selected lectures will be deleted",
                                                        btn1Text:"Delete",
                                                        btn2Text:"Cancel",
                                                        btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                                        btn2Handler: ()=>setConfirmationModal(null)
                                                    })
                                                )}>
                                                    <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                                <button className='mt-4 flex items-center gap-x-2 text-yellow-50' onClick={()=>setAddSubsection(section._id)}>
                                    <AiOutlinePlus className="text-lg"/>
                                    <p>Add Lecture</p>
                                </button>
                            </div>
                        </details>
                    ))
                }
            </div>

            {
                addSubsection  ?
                (<SubSectionModal modalData={addSubsection} setModalData={setAddSubsection} add={true}/>):
                (
                    viewSubsection ?
                    (<SubSectionModal modalData={viewSubsection} setModalData={setViewSubsection} view={true}/>):
                    (
                        editSubsection ?
                        (<SubSectionModal modalData={editSubsection} setModalData={setEditSubsection} edit={true}/>):
                        (<div></div>)
                    )
                )
            }

            {
                confirmationModal ?
                (<ConfirmationModal modalData={confirmationModal}/>) :
                (<div></div>)
            }
        </div>
    )
}