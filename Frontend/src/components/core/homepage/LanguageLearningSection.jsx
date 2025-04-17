import HighlightText from "./HighlightText";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png"
import compareWithOther from "../../../assets/Images/Compare_with_others.png"
import planYourLesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAbutton from "./CTAbutton";


function LanguageLearningSection(){
    return(
        <div className="mt-[130px] mb-24">
            <div className="flex flex-col gap-5 items-center">
                <div className="text-4xl text-center font-semibold">
                    Your swiss knife for <HighlightText text={"learning any language"}/>
                </div>

                <div className="text-center font-medium  w-[70%] mx-auto text-[17px] mt-3 text-richblack-600">
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>

                <div className="flex flex-row items-center justify-center mt-5">
                    <img src={KnowYourProgress} alt="KnowYourProgress" className="object-contain -mr-32"/>
                    <img src={compareWithOther} alt="compareWithOther" className="object-contain"/>
                    <img src={planYourLesson} alt="planYourLesson" className="object-contain -ml-32"/>
                </div>

                <div className="w-fit">
                    <CTAbutton active={true} linkto={"/signup"}>
                        <div>
                            Learn More
                        </div>
                    </CTAbutton>
                </div>

            </div>
        </div>
    )
}

export default LanguageLearningSection;