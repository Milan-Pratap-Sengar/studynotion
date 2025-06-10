import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { IoCaretBackCircleSharp } from "react-icons/io5";
import IconBtn from "../../common/IconBtn";
import { IoIosArrowDown } from "react-icons/io";

export default function VideoDetailSidebar({setReviewModal}){

    // it stores the id of currently clicked/opened section
    const [activeStatus,setActiveStatus]=useState("")
    // it stores the id of clicked/opened subsection(or video)
    const [videoBarActive,setVideoBarActive]=useState("")
    const navigate=useNavigate()
    const location=useLocation()
    const {sectionId,subsectionId}=useParams()
    const {courseSectionData,courseEntireData,totalNoOfLectures,completedLectures}=useSelector((state)=>state.viewCourse)


    useEffect(()=>{
        // new syntax of writing function in useEffect
        ;(()=>{
            if(!courseSectionData.length){
                // if there is no section in the course
                return
            }
            // here , we will find the index of current section and subsection to highlight it with yellow color to show it as active lecture/current lecture.
            const currentSectionIndex= courseSectionData.findIndex((sec)=>sec._id === sectionId)
            const currentSubsectionIndex=courseSectionData?.[currentSectionIndex]?.subsection.findIndex( (subsec)=>subsec._id === subsectionId)
            const activeSectionId=courseSectionData?.[currentSectionIndex]?._id
            const activeSubsectionId=courseSectionData?.[currentSectionIndex]?.subsection?.[currentSubsectionIndex]?._id
            // set current section here
            setActiveStatus(activeSectionId)
            // set currentsubsection here
            setVideoBarActive(activeSubsectionId)
        })()
    },[courseSectionData,courseEntireData,location.pathname])

    return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">

                {/*  heading and buttons*/}
                <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                    {/* buttons */}
                    <div className="flex w-full items-center justify-between ">
                        <div
                            onClick={() => {navigate(`/dashboard/enrolled-courses`)}}
                            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                            title="back"
                        >
                            <IoCaretBackCircleSharp size={30} />
                        </div>
                        <IconBtn text="Add Review" customClasses="ml-auto" onClick={() => setReviewModal(true)} />
                    </div>

                    {/* heading */}
                    <div className="flex flex-col">
                        <p>{courseEntireData?.courseName}</p>
                        <p className="text-sm font-semibold text-richblack-500">
                            {completedLectures?.length} / {totalNoOfLectures}
                        </p>
                    </div>
                </div>


                {/* section and subsections */}
                <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((section, index) => (
                        <div className="mt-2 cursor-pointer text-sm text-richblack-5" onClick={() => setActiveStatus(section?._id)} key={index}>

                            {/* Section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold"> {section?.sectionName} </div>
                                <div className="flex items-center gap-3">
                                    {/* <span className="text-[12px] font-medium">
                                        Lession {section?.subSection.length}
                                    </span> */}
                                    <span className={`${ activeStatus === section?._id ? "rotate-0" : "rotate-180"} transition-all duration-500`}>
                                        <IoIosArrowDown />
                                    </span>
                                </div>
                            </div>

                            {/* Sub Sections */}
                            {
                                activeStatus === section?._id && (
                                    <div className="transition-[height] duration-500 ease-in-out">
                                    {
                                        section.subsection.map((topic, i) => (
                                            <div
                                                className={`flex gap-3  px-5 py-2 ${ videoBarActive === topic._id ? "bg-yellow-200 font-semibold text-richblack-800": "hover:bg-richblack-900"} `}
                                                key={i}
                                                onClick={() => {
                                                    navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                                                    setVideoBarActive(topic._id)
                                                }}
                                            >
                                                <input type="checkbox" checked={completedLectures.includes(topic?._id)} onChange={() => {}}/>
                                                {topic.title}
                                            </div>
                                        ))
                                    }
                                    </div>
                                )
                            }
                        </div>
                ))
                }
                </div>
        </div>
    </>
  )
}