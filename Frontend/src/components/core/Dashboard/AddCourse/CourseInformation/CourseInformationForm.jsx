import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/CourseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import IconBtn from "../../../../common/IconBtn";
import toast from "react-hot-toast";
import {setStep,setCourse} from "../../../../../redux/Slices/CourseSlice"
import UploadContent from "../UploadContent";
import ChipInput from "./ChipInput";
import { COURSE_STATUS } from "../../../../../utils/Constants";

export default function CourseInformationForm(){

    const {register, handleSubmit,setValue,getValues,formState:{errors}}=useForm();
    
    // editCourse is a boolean value which indicate that whether we update or course or not.It means many functionalities of this component will ne activated only when we click on edit button

    const dispatch=useDispatch();
    const {course, editCourse}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const [loading,setLoading]=useState(false)
    const [courseCategories, setCourseCategories]=useState([])


    // we will fetch the course categories from our database
    const getCategories=async()=>{
        setLoading(true)
        const categories=await fetchCourseCategories();
        if(categories.length > 0){
            setCourseCategories(categories)
        }
        setLoading(false)
    }

    // ON initial rendering,we will fetch our all categories from backend and set the values of each input field as previously saved values..if you edit it first time, they are null
    useEffect(()=>{
        getCategories();
        if(editCourse){
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.categoryId);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
            // setValue("")
        }
    },[])


    // it simply check whether our form is update or not
    function isFormUpdated() {
        const currentValues = getValues();
        // currentValues. means "current values of input fields" course. means "Already saved values"
        if (currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.categoryId._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ) {
            // It means that form is updated
            return true;
        }
        else {
            return false;
        }
    }

    const submitHandler = async(data) => {
        
        // if we are edit our course details and our form is updated, we will create a new form in which all the updated details will be stored...Then after,all the updated details of this new form will be transferred to our Backend call
        if(editCourse) {
            if(isFormUpdated()) {
                const currentValues = getValues();
                const formData = new FormData(); 

                formData.append("courseId", course._id);
                
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }

                if(currentValues.courseTags.toString() !== course.tag.toString() ){
                    formData.append("tag",JSON.stringify(data.courseTags))
                }

                if(currentValues.courseImage !== course.thumbnail){
                    formData.append("thumbnail",data.courseImage)
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.categoryId._id) {
                    formData.append("categoryId", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }

                setLoading(true);

                // now save these updated details in the database
                const result = await editCourseDetails(formData, token);
                
                setLoading(false);
                // if there is no error and we get a successfull response, then we move to next step
                if(result) {
                    setStep(2);
                    dispatch(setCourse(result));
                }
            } 
            else {
                toast.error("NO Changes made so far");
            }
            return;
        }

        //if the course is not edit , then,create a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("categoryId", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("tag",JSON.stringify(data.courseTags))
        formData.append("thumbnail",data.courseImage)
        console.log("Line 134 : "+formData.toString())

        setLoading(true);
        console.log("BEFORE add course API call");
        console.log("PRINTING FORMDATA", formData);
        const result = await addCourseDetails(formData,token);
        
        if(result) {
            dispatch(setStep(2))
            dispatch(setCourse(result));
        }
        setLoading(false);
        console.log("PRINTING FORMDATA", formData);
        console.log("PRINTING result", result);

    }


    return(
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8  rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseTitle" className="text-sm text-richblack-5"> Course Title <sup  className="text-pink-200">*</sup></label>
                <input id="courseTitle" placeholder="Enter Course Title" {...register("courseTitle",{required:true})} className="form-style w-full"/>
                {
                    errors.courseTitle && (<span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required**</span>)
                }
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5"  htmlFor="courseShortDesc">Course Short Description<sup>*</sup></label>
                <textarea id="courseShortDesc" placeholder="Enter Course Description" {...register("courseShortDesc",{required:true})} className="form-style resize-x-none min-h-[130px] w-full"/> 
                {
                    errors.courseShortDesc && (<span className="ml-2 text-xs tracking-wide text-pink-200"> Course Description is required**</span>)
                }
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5"  htmlFor="coursePrice"> Course Price <sup className="text-pink-200">*</sup></label>
                <div className="relative">
                    <input className="form-style w-full !pl-12" id="coursePrice" placeholder="Enter Course Price" {...register("coursePrice",{required:true,valueAsNumber:true,pattern: {value: /^(0|[1-9]\d*)(\.\d+)?$/, }})}/> 
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400"/>
                </div>
                {
                    errors.coursePrice && (<span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required**</span>)
                }
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">Course Category<sup>*</sup></label>
                <select className="form-style w-full" id="courseCategory" defaultValue="" {...register("courseCategory",{required:true})}>
                    <option value="" disabled>Choose a Category</option>
                    {
                        !loading && courseCategories.map((category,index)=>(
                            <option key={index} value={category?._id} >{category?.name}</option>
                        ))
                    }
                </select>
                {
                    errors.courseCategory && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">  Course Category is required </span> 
                    )
                }
            </div>

            {/* create tags input */}

        <ChipInput label="Tag" name="courseTags" placeholder="Enter tags and press enter" register={register} errors={errors} setValue={setValue} getValues = {getValues}/>

        {/* create a component for uploading and showing preview of media */}
        <UploadContent  name="courseImage" label="Course Thumbnail"  register={register} setValue={setValue}  errors={errors}  editData={editCourse ? course?.thumbnail : null}  />


        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5"  htmlFor="coursebenefits">Benefits of the course<sup>*</sup></label>
            <textarea className="form-style resize-x-none min-h-[130px] w-full" id='coursebenefits' placeholder='Enter Benefits of the course' {...register("courseBenefits", {required:true})} />
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Benefits of the course are required**
                    </span>
                )
            }
        </div>

        <RequirementField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`} onClick={()=> dispatch(setStep(2))}>Continue without Saving</button>
                )
            }

            <IconBtn text={!editCourse ? "Next":"Save Changes"}/>
        </div>
        </form>
    )
}