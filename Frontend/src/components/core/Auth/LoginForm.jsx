import { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {login} from "../../../services/operations/authAPI"

import {FcGoogle} from "react-icons/fc"


function LoginForm(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [FormData,setFormData]=useState({email:"",password:""})
    const [showPassword,setShowPassword]=useState(false);
    const {email,password}=FormData

    function changeHandler(event){
        const {name,value}=event.target;
        setFormData((prev)=>(
            {
            ...prev, [name]:value
            }
        ))
    }

    function SubmitHandler(event){
        event.preventDefault()
        dispatch(login(email, password, navigate))
      }

    function showPasswordHandler(){
        setShowPassword(!showPassword)
    }

    
    return (
        <div>
            <form onSubmit={SubmitHandler} className="flex flex-col w-full gap-y-4 mt-6">

                <label className="w-full"> 
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Email Address <sup className="text-pink-200">*</sup></p>
                    <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type="email" name="email" value={email} onChange={changeHandler} placeholder="Enter Your Email" required />
                </label>

                <label className="w-full relative">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Password <sup className="text-pink-200">*</sup></p>
                    <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type={showPassword? "text": "password"} name="password" value={password} onChange={changeHandler} placeholder="Enter Your Password" required />
                    <span className="absolute right-3 top-[38px] cursor-pointer" onClick={showPasswordHandler}>
                        {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
                    </span>
                </label>

                <Link to="/forgot-password">
                    <p className="text-xs mt-[1] text-blue-100 max-w-max ml-auto">Forgot Password?</p>
                </Link>

                <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6">Sign In</button>
            </form>
            
            <div className="flex w-full items-center my-4 gap-x-2">
                <div className="w-full h-[1px] bg-richblack-700"/>
                <p className="text-richblack-700 font-medium leading[1.375rem]">OR</p>
                <div className="w-full h-[1px] bg-richblack-700"/>
            </div>

            <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px] py-[8px] gap-x-2 mt-6">
                <FcGoogle/>
                <p>Sign Up with Google</p>
            </button>
        </div>

    )
}

export default LoginForm;