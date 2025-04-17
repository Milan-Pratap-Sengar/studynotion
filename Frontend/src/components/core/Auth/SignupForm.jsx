import { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../redux/Slices/AuthSlice";
import {ACCOUNT_TYPE} from "../../../utils/Constants"
import Tab from "../../common/Tab";

function SignupForm({setIsLoggedIn}){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const[FormData,setFormData]=useState({firstName:"", lastName:"" ,email:"", password:"", confirmPassword:""})
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const [accountType, setAccountType]=useState(ACCOUNT_TYPE.STUDENT)

    const {firstName,lastName,email, password, confirmPassword}=FormData;

    function changeHandler(event){
        const {name,value}=event.target;
        setFormData((prev)=>(
            {
            ...prev, [name]:value
            }
        ))
    }

    function showPasswordHandler(){
        setShowPassword(!showPassword)
    }
    function showConfirmPasswordHandler(){
        setShowConfirmPassword(!showConfirmPassword)
    }

    function SubmitHandler(event){
        event.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password Not Matched")
            return;
        }
        
        const signupData = {
            ...FormData,
            accountType,
        }
        // Setting signup data to state To be used after otp verification
        dispatch(setSignupData(signupData))
        // Send OTP to user for verification
        dispatch(sendOtp(FormData.email, navigate))

        // Reset
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        setAccountType(ACCOUNT_TYPE.STUDENT)
    } 

    const tabData = [
        {
          id: 1,
          tabName: "Student",
          type: ACCOUNT_TYPE.STUDENT,
        },
        {
          id: 2,
          tabName: "Instructor",
          type: ACCOUNT_TYPE.INSTRUCTOR,
        },
      ]

    return (
        <div>

            {/* ****************TAB *************** */}
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />
            
            {/* **************FORM ****************** */}

            <form className="h-[40vh]" onSubmit={SubmitHandler} >

                <div className="flex gap-x-4 mt-[15px]">
                    <label className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">First Name <sup className="text-pink-200"> *</sup></p>
                        <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type="text" name="firstName" value={firstName} placeholder="Enter your Firstname" onChange={changeHandler} required></input>
                    </label>

                    <label className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Last Name <sup className="text-pink-200"> *</sup></p>
                        <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type="text" name="lastName" value={lastName} placeholder="Enter your Lastname" onChange={changeHandler} required></input>
                    </label>
                </div>

                <div className="mt-[15px]">
                    <label className="w-full mt-[20px]">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Email <sup className="text-pink-200"> *</sup></p>
                        <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type="email" name="email" value={email} placeholder="Enter your Email" onChange={changeHandler} required></input>
                    </label>
                </div>

                <div className="flex gap-x-4 mt-[15px]">
                    <label className=" w-full relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Create Password<sup className="text-pink-200"> *</sup></p>
                        <input className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type={showPassword? "text" : "password"} name="password" value={password} placeholder="Enter Password" onChange={changeHandler} required></input>
                        <span className="absolute right-3 top-[40px] cursor-pointer" onClick={showPasswordHandler}>
                            {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
                        </span>
                    </label>

                    <label className=" w-full relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Confirm Password<sup className="text-pink-200"> *</sup></p>
                        <input className=" bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]" type={showConfirmPassword? "text" : "password"} name="confirmPassword" value={confirmPassword} placeholder="Confirm Password" onChange={changeHandler} required></input>
                        <span className="absolute right-3 top-[40px] cursor-pointer" onClick={showConfirmPasswordHandler}>
                            {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
                        </span>
                    </label>
                </div>

                <button className=" w-full bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-10">Create Account</button>
            </form>
        </div>
    )
}

export default SignupForm;