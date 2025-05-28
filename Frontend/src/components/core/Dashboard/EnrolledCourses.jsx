import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/ProfileAPI";
import ProgressBar from "@ramonak/react-progress-bar";

function EnrolledCourses(){

    const {token}=useSelector((state)=> state.auth)
    const [EnrolledCourses,setEnrolledCourses]=useState(null);


    const getEnrolledCourses= async()=>{
        try{
            
            const response=await getUserEnrolledCourses(token)
            setEnrolledCourses(response)
        }
        catch{
            console.log("Unable to get Enrolled Courses")
        }
    }

    useEffect(()=>{
        getEnrolledCourses()
    },[])

    return(
        <div className="text-white">
            <div>Enrolled Courses</div>
            {
                ! EnrolledCourses ?
                (
                    <div className="spinner"/>
                ):
                (
                    EnrolledCourses.length==0 ?
                    (
                        <div>You have not Enrolled in any course yet...</div>
                    ):
                    (
                        <div>
                            <div>
                                <p>Course Name</p>
                                <p>Duration</p>
                                <p>Progess</p>

                                {/* Now display each card */}
                                {
                                    EnrolledCourses.map((course,index)=>{
                                        <div key={index}>
                                            <div>
                                                <img src={course.thumbnail}/>
                                                <div>
                                                    <p>{course.courseName}</p>
                                                    <p>{course.courseDescription}</p>
                                                </div>
                                            </div>

                                            <div>{course?.courseDuration}</div>

                                            <div>
                                                <p>Progress : {course.progressPercentage || 0}%</p>
                                                <ProgressBar completed={course.progressPercentage || 0} height="8px" isLabelVisible={false} />
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>    
                    )
                )
            }
        </div>
    )
}

export default EnrolledCourses;