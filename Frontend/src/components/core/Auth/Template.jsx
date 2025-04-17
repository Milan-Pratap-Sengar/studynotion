import { useSelector } from "react-redux";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import FrameImg from "../../../assets/Images/frame.png"
// import {FcGoogle} from "react-icons/fc"

function Template({title,desc1,desc2,formType,image}){

    const {Loading}=useSelector((state) => state.auth);

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                Loading ? 
                (<div className="spinner"/>) :
                (
                    <div className="flex w-11/12 justify-between max-w-[1160px] py-5 mx-auto gap-x-12 gap-y-0">
                        <div className="w-11/12  max-w-[450px]">
                            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">{title}</h1>

                            <p className="text-[1.125rem] leading-[1.625rem] mt-4">
                                <span className="text-richblack-100">{desc1}</span> <br />
                                <span className="text-blue-100 italic">{desc2}</span>
                            </p>

                            {formType==='signup' ? (<SignupForm/>) : (<LoginForm/>)}

                            {/* <div className="flex w-full items-center my-4 gap-x-2">
                                <div className="w-full h-[1px] bg-richblack-700"/>
                                <p className="text-richblack-700 font-medium leading[1.375rem]">OR</p>
                                <div className="w-full h-[1px] bg-richblack-700"/>
                            </div>

                            <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px] py-[8px] gap-x-2 mt-6">
                                <FcGoogle/>
                                <p>Sign Up with Google</p>
                            </button> */}

                        </div>
            
                        <div className="relative  w-11/12 max-w-[450px] mt-[50px] ">
                            <img src={FrameImg} alt="bg-img" height={504} width={558} loading="lazy"/>
                            <img src={image} alt="img" height={490} width={558} loading="lazy" className="absolute -top-4 right-4  "/>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Template