import { useSelector } from "react-redux"
import CourseInformationForm from "../AddCourse/CourseInformation/CourseInformationForm"
import CourseBuilderForm from "../AddCourse/CourseBuilder/CourseBuilderForm"
import { FaCheck } from "react-icons/fa";
import React from "react";
import PublishCourseForm from "./PublishCourse/PublishCourseForm";

export default function RenderSteps(){

    const {step} = useSelector((state)=>state.course)

    const steps=[
        {
            id:1,
            title:"Course Information"
        },
        {
            id:2,
            title:"Course builder"
        },
        {
            id:3,
            title:"Publish"
        }
    ]


    return (
        <>
            <div className="relative mb-2 flex w-full justify-center">
                {
                    steps.map((item)=>(
                        // <></> and <React.fregment></React.fregment> are same..but additionally,you can pass key in <React.fregment/>
                        <React.Fragment key={item.id}>
                            <div className="flex flex-col items-center " key={item.id}>
                                <button className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${ step === item.id ? "border-yellow-50 bg-yellow-900 text-yellow-50" : "border-richblack-700 bg-richblack-800 text-richblack-300" } ${step > item.id && "bg-yellow-50 text-yellow-50"}} `} >
                                    {
                                        step > item.id ? (<FaCheck className="font-bold text-richblack-900" />) : (item.id)
                                    }
                                </button>
                            </div>
                            {
                                item.id !== steps.length && (
                                    <>
                                        <div className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${ step > item.id  ? "border-yellow-50" : "border-richblack-500" } `} />
                                    </>
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </div>

            <div  className="relative mb-16 flex w-full select-none justify-between">
                {
                    steps.map((item)=>(
                        <React.Fragment key={item.id}>
                            <div className="flex min-w-[130px] flex-col items-center gap-y-2">
                                <p className={`text-sm ${ step >= item.id ? "text-richblack-5" : "text-richblack-500" }`}>{item.title}</p>
                            </div>
                        </React.Fragment>
                    ))
                }
            </div>
    
            {
                step===1 && <CourseInformationForm/>
            }
            {
                step===2 && <CourseBuilderForm/>
            }
            {
                step===3 && <PublishCourseForm/>
            }
        </>
    )
}