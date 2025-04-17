import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { FaLongArrowAltLeft } from "react-icons/fa";


function ForgetPassword(){


    const [emailSent,setEmailSent]=useState(false);
    const [email,setEmail]=useState("")
    const {loading} = useSelector( (state) => state.auth )
    const dispatch=useDispatch();

    function submitHandler(event){
        event.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))
    }

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                loading ?
                (
                    <div className="spinner  mt-[20%]"></div>
                ) :
                (
                    <div className="max-w-[500px] p-4 lg:p-8">
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                            {
                                emailSent ? "Check Your Email" : "Reset Your Password" 
                            }
                        </h1>
                        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                            {
                                emailSent ? `We have sent the reset email to "${email}"` : "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                            }
                        </p>
                        <form onSubmit={submitHandler}>
                            {
                                !emailSent && (
                                    <label className="w-full">
                                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Email Address <sup className="text-pink-200">*</sup></p>
                                        <input required type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email Address" className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)]  text-richblack-5 w-full p-[12px]"/>
                                        
                                    </label> 
                                )
                            }
                            <button className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-bold text-richblack-900">
                                {
                                    emailSent ? "Resend Email" : "Submit"
                                }
                            </button>
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

export default ForgetPassword;