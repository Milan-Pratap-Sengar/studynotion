import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { markLectureAsComplete } from "../../../services/operations/CourseDetailsAPI"
import { updateCompletedLectures } from "../../../redux/Slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"
import { Player,BigPlayButton } from 'video-react';
import "video-react/dist/video-react.css"


export default function VideoDetails(){

    const {subsectionId,sectionId,courseId}=useParams()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const playerRef=useRef()
    const location=useLocation()

    const {token}=useSelector((state)=>state.auth)
    const {courseSectionData,courseEntireData,completedLectures}=useSelector((state)=>state.viewCourse)
    
    const [videoData,setVideoData]=useState([]) //it stores the url and other details of the video
    const [previewSource, setPreviewSource] = useState("") //it simply contains the thumbnail of the video
    const [videoEnded,setVideoEnded]=useState(false)
    const [loading,setLoading]=useState(false)

    
    const setVideoSpecificDetails=async()=>{
        if(! courseSectionData.length ){
            return
        }
        if(!sectionId || !subsectionId || !courseId){
            navigate("/dashboard/enrolled-courses")
        }

        // It will fetch all the details of current section
        const sectionData=courseSectionData.filter((sec)=>sec._id === sectionId)
        console.log("section data is ",sectionData)
        // it will fetch the details of 1st video of that section
        const VideoDetails=sectionData?.[0]?.subsection.filter((subsec)=> subsec._id === subsectionId)
        console.log("video details is ",VideoDetails)
        setVideoData(VideoDetails[0])
        setVideoEnded(false)
        setPreviewSource(courseEntireData.thumbnail)
    }

    useEffect(()=>{
        setVideoSpecificDetails()
    },[courseSectionData,courseEntireData,location.pathname])

    // is it a first video of course?
    const isFirstVideo=()=>{
        const currentSectionIndex=courseSectionData?.findIndex((sec)=>sec._id === sectionId)
        const currentSubsectionIndex=courseSectionData?.[currentSectionIndex]?.subsection?.findIndex((subsec)=>subsec._id === subsectionId)

        if(currentSectionIndex === 0 && currentSubsectionIndex === 0){
            return true
        }
        else{
            return false
        }
    }

    // is it a last video of course?
    const isLastVideo=()=>{
        const currentSectionIndex=courseSectionData?.findIndex((sec)=>sec._id === sectionId)
        const currentSubsectionIndex=courseSectionData?.[currentSectionIndex]?.subsection?.findIndex((subsec)=>subsec._id === subsectionId)
        const noOfSubsections= courseSectionData?.[currentSectionIndex]?.subsection?.length

        // if it is the last section and it is the last subsection of that last section
        if(currentSectionIndex === courseSectionData.length-1  && currentSubsectionIndex === noOfSubsections-1){
            return true
        }
        else{
            return false
        }
    }

    const goToNextVideo=()=>{
        const currentSectionIndex=courseSectionData?.findIndex((sec)=>sec._id === sectionId)
        const currentSubsectionIndex=courseSectionData?.[currentSectionIndex]?.subsection?.findIndex((subsec)=>subsec._id === subsectionId)
        const noOfSubsections= courseSectionData?.[currentSectionIndex]?.subsection?.length

        // when current video is not last video of this section
        if(currentSubsectionIndex !== noOfSubsections-1){
            //simply move to the next video of the same section
            const nextSubsectionId=courseSectionData?.[currentSectionIndex]?.subsection?.[currentSubsectionIndex+1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubsectionId}`)
        } 
        else{
            // move to first video of next section
            const nextSectionId=courseSectionData?.[currentSectionIndex+1]._id
            const firstSubsectionId=courseSectionData?.[currentSectionIndex+1].subsection?.[0]._id
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubsectionId}`)
        }
    }

    const goToPrevVideo=()=>{
        const currentSectionIndex=courseSectionData?.findIndex((sec)=>sec._id === sectionId)
        const currentSubsectionIndex=courseSectionData?.[currentSectionIndex]?.subsection?.findIndex((subsec)=>subsec._id === subsectionId)
        const noOfPrevSubsections= courseSectionData?.[currentSectionIndex-1]?.subsection?.length // it is the no of subsections in prev section
        console.log(noOfPrevSubsections)

        // when it is not the first video of current section
        if(currentSubsectionIndex !== 0){
            // simply move to prev video of same section
            const prevSubsectionId=courseSectionData?.[currentSectionIndex]?.subsection?.[currentSubsectionIndex-1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubsectionId}`)
        }
        else{
            // when it is the first video of current section,,then just move to last video or prev section
            const prevSectionId=courseSectionData?.[currentSectionIndex-1]._id
            const lastSubsectionId=courseSectionData?.[currentSectionIndex-1]?.subsection?.[noOfPrevSubsections-1]?._id
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${lastSubsectionId}`)
        }
    }

    const handleLectureCompletion=async()=>{
        setLoading(true)
        const res = await markLectureAsComplete({ courseId: courseId, subsectionId: subsectionId },token)
        if (res) {
            dispatch(updateCompletedLectures(subsectionId))
        }
        setLoading(false)
    }

    console.log("The video details are",videoData)

    return (
        <div className="flex flex-col gap-5 text-white">
            {
                !videoData ? 
                (
                    <img src={previewSource} alt="Preview" className="h-full w-full rounded-md object-cover"/>
                ) : 
                (
                    // take reference of document
                    <Player ref={playerRef} aspectRatio ="16:9" playsInline onEnded={() => setVideoEnded(true)} src={videoData?.videoURL}>
                        <BigPlayButton position="center" />

                        {/* Render When Video Ends */}
                        {
                            videoEnded && (
                                <div 
                                    style={{backgroundImage:"linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",}}
                                    className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                                >
                                    {
                                        !completedLectures.includes(subsectionId) && (
                                            <IconBtn disabled={loading} onClick={() => handleLectureCompletion()} text={!loading ? "Mark As Completed" : "Loading..."} customClasses="text-xl max-w-max px-4 mx-auto"/>
                                        )
                                    }
                                    <IconBtn 
                                        disabled={loading}
                                        onClick={() => {
                                                    if (playerRef?.current) {
                                                        // set the current time of the video to 0
                                                        playerRef?.current?.seek(0)
                                                        setVideoEnded(false)
                                                    }
                                        }}
                                        text="Rewatch"
                                        customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                                    />
                                    <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                        {
                                            !isFirstVideo() && (
                                                <button disabled={loading} onClick={goToPrevVideo} className="blackButton"> Prev </button>
                                            )
                                        }
                                        {
                                            !isLastVideo() && (
                                                <button disabled={loading} onClick={goToNextVideo} className="blackButton"> Next </button>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </Player>
                )
            }

            <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6">{videoData?.description}</p>
        </div>
    )
}
