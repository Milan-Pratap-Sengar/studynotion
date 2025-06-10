import { Link, NavLink } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import HighlightText from "../components/core/homepage/HighlightText";
import CTAbutton from "../components/core/homepage/CTAbutton";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/homepage/CodeBlocks";
import TimelineSection from "../components/core/homepage/TimelineSection";
import LanguageLearningSection from "../components/core/homepage/LanguageLearningSection";
import InstructorSection from "../components/core/homepage/InstructorSection";
import ExploreMore from "../components/core/homepage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/reviewSlider";



function Home(){
    return (
        <div>

            {/* *********************************   SECTION-1 {Black-Background Section} **************************************************  */}
            <div className="relative mb-[70px] mx-auto  flex flex-col w-11/12 items-center justify-between text-white max-w-maxContent">

                {/* **************** Introduction section ************ */}
                <Link to={"/signup"} className="mt-16">
                    <div className="group p-1  mx-auto rounded-full drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900 ">
                            <p className="cursor-pointer">Become an Instructor</p>
                            <FaArrowRightLong />
                        </div>
                    </div>
                </Link>

                <div className="text-center font-semibold text-[35px] mt-7">
                    Empower Your Future with <HighlightText text={"Coding Skills"}/>
                </div>

                <div className="w-[90%] font-bold text-center text-lg mt-4 mb-4  text-richblack-300 ">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAbutton active={true} linkto={"/signup"}>Learn More </CTAbutton>
                    <CTAbutton active={false} linkto={"/login"}>Book a Demo </CTAbutton>
                </div>

                <div className="shadow-[10px_-5px_50px_-5px] shadow-blue-200 mx-3 my-16">
                    <video className="shadow-[20px_20px_rgba(255,255,255)]" autoPlay  loop muted width={1100} >
                        <source type="video/mp4" src={Banner}/>
                    </video>
                </div>


                {/* ************ code section-1 *****************/}
                <div>
                    <CodeBlocks
                    backgroundGradient={"bg-caribbeangreen-50"}
                    position={"lg:flex-row"} 
                    heading={
                        <div className="text-4xl font-semibold">
                            Unlock your <HighlightText text={"coding potential"}/> with our online courses.
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            btnText: "Try it Yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={
                        `<!DOCTYPE html>
                        <html>
                        <head>
                        <title>Example</title>
                        <linkrel="stylesheet"href="styles.css">
                        </head>
                        <body>
                        <h1><a href="/">Header</a></h1>
                        <nav><a href="one/">One</a><a href="two/">Two</a>
                        </nav>
                        </body>
                        </html>`
                    }
                    codeColor={"text-yellow-100"}
                    >
                    </CodeBlocks>
                </div>


                {/* *********** code section-2 ************** */}
                <div>
                    <CodeBlocks

                    backgroundGradient={"bg-yellow-100"}
                    position={"lg:flex-row-reverse"} 
                    heading={
                        <div className="text-4xl font-semibold">
                            Start <HighlightText text={"coding in seconds."}/>
                        </div>
                    }
                    subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                        {
                            btnText: "Continue Lesson",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={
                        `import React from "react";
                         import CTAbutton from "./button";
                         import {TypeAnimation} from "react-animation";
                         import {FaArrowRightLong} from "react-icons";
                         
                         const Home = () => {
                            return(
                                <div>
                                    HOME
                                </div>
                            )
                         }`
                    }
                    codeColor={"text-caribbeangreen-50"}
                    >
                    </CodeBlocks>
                </div>

                {/* ************** section-3 {Explore more Section}************* */}

                <ExploreMore/>
            </div>




            {/* *********************************************   SECTION-2 {white-Background section} ************************************************  */}

            <div className="bg-pure-greys-5 text-richblack-700 ">

                {/* **************** Background-image section */}
                <div className="homepage_bg h-[310px]">
                    <div className="w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto">
                            <div className="h-[180px]"></div>
                            <div className="flex flex-row gap-7 text-white">
                                <CTAbutton active={true} linkto={"/signup"}>
                                    <div className="flex gap-3 items-center">
                                        Explore full Catalog
                                        <FaArrowRightLong/>
                                    </div>                                
                                </CTAbutton>
                                <CTAbutton active={false} linkto={"/signup"}>
                                    <div>Learn more</div>
                                </CTAbutton>
                            </div>
                    </div>
                </div>

                {/* *************** Job Demand Section ************  */}
                <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">       
                    <div className="flex flex-row gap-5 mb-10 mt-[95px]" >
                        <div className="text-4xl font-semibold w-[45%]">
                        Get the skills you need for a <HighlightText text={"job that is in demand"}/>
                        </div>

                        <div className="flex flex-col gap-10 ml-28 w-[40%] items-start">
                            <div className="text-[18px] ">
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAbutton active={true} linkto={"/signup"}>
                                <div>Learn More</div>
                            </CTAbutton>
                        </div>
                    </div>

                     {/* *************** Timeline Section ************  */}
                     <TimelineSection/> 

                    {/* *************** language learning Section ************  */}
                    <LanguageLearningSection/>

                </div>

                

            </div>



            {/* ************************************   SECTION-3 {Black Background-Review-section} ****************************************************/}


            <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                    <InstructorSection/>
                    <h2 className='text-center text-4xl font-semibold mt-10'>Review from Other Learners</h2>
                    <ReviewSlider/>
            </div>


            {/* ************   FOOTER **************  */}
            
            <Footer/>

        </div>
    )
}

export default Home;