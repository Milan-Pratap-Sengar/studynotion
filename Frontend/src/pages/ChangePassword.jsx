import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { useLocation, useNavigate } from "react-router-dom";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";


function ChangePassword(){
  
    const [formData,setFormData]=useState({password:"", confirmPassword:""})
    const [showPassword, setShowPassword]=useState(false);
    const [showConfirmPassword, setShowConfirmPassword]=useState(false);
    const {password, confirmPassword}=formData
    const {loading}=useSelector((state) => state.auth)
    const dispatch=useDispatch();
    const location=useLocation()
    const navigate=useNavigate();

    function submitHandler(event){
        event.preventDefault();
        const token=location.pathname.split("/").at(-1)
        dispatch(resetPassword(password, confirmPassword, token,navigate))
    }

    const changeHandler = (e)=>{
        setFormData( (prevData) => (
            {
                ...prevData,
                [e.target.name] : e.target.value
            }
        ))
    }

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                loading ?
                (
                    <div className="spinner mt-[20%]"/>
                ) :
                (
                    <div className="max-w-[500px] p-4 lg:p-8">
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">Choose New Password</h1>
                        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">Almost done. Enter your New Password and you are all set.</p>
                        <form onSubmit={submitHandler}>
                            <label className="relative">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">New Password <sup className="text-pink-200">*</sup></p>
                                <input required type={showPassword ? "text" : "password"} name="password" value={password} onChange={changeHandler} placeholder="Enter New Password" className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                                <span onClick={() => setShowPassword( (prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                    {
                                        showPassword ?  <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={24}/> : <AiOutlineEye  fill="#AFB2BF" fontSize={24}/> 
                                    }
                                </span>
                            </label>

                            <label className="relative mt-3 block">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Confirm Password <sup className="text-pink-200">*</sup></p>
                                <input required type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={confirmPassword} onChange={changeHandler} placeholder="Enter Confirm Password" className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                                <span onClick={() => setShowConfirmPassword( (prev) => !prev)}  className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                    {
                                        showConfirmPassword ?  <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={24}/> : <AiOutlineEye fill="#AFB2BF" fontSize={24}/> 
                                    }
                                </span>
                            </label>

                            <button className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">Reset Password</button>
                        </form>
                        <div className="mt-6 flex items-center justify-start gap-2">
                            <Link to="/login" className="flex items-center gap-2">
                                    <FaLongArrowAltLeft className="text-white" />
                                    <p className="flex items-center gap-x-2 text-richblack-5">Back to Login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ChangePassword;