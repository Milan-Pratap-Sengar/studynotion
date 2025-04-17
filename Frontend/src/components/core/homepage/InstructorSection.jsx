import Instructor from "../../../assets/Images/Instructor.png"
import CTAbutton from "./CTAbutton";
import HighlightText from "./HighlightText";
import { FaArrowRightLong } from "react-icons/fa6";

function InstructorSection(){
    return(
        <div className="mt-20 mb-72">
            <div className="flex flex-row items-center gap-20">

                <div className="w-[50%] shadow-white shadow-[-20px_-20px_0_0] mr-16">
                    <img src={Instructor} alt="InstructorImage" className="shadow-white"/>
                </div>

                <div className="flex flex-col gap-10 w-[50%]">
                    <div className="font-semibold text-4xl w-[50%]">Become an <HighlightText text={"Instructor"}/></div>

                    <p className="font-bold text-[18px] w-[100%] text-richblack-300">Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>

                    <div className="w-fit">
                        <CTAbutton linkto={"/signup"} active={true}>
                            <div className="flex flex-row gap-2 items-center">
                                Start Learning Today
                                <FaArrowRightLong/>
                            </div>
                        </CTAbutton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorSection;