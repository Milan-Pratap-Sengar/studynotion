import { TypeAnimation } from "react-type-animation";
import CTAbutton from "../homepage/CTAbutton";
import { FaArrowRightLong } from "react-icons/fa6";
import "../../../App.css"

function CodeBlocks({position,heading,subheading,ctabtn1,ctabtn2,codeblock, backgroundGradient,codeColor}){
    return(
        <div className={`flex ${position} my-20 justify-between gap-10`}>

            {/* *************** section-1 {Heading And Paragraph Part} **************** */}
            <div className="flex flex-col w-[50%] gap-8">
                {heading}

                <div className="text-richblack-300 font-semibold text-[18px]">
                    {subheading}
                </div>

                <div className="flex gap-7 mt-7">
                    <CTAbutton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex gap-2 items-center">
                            {ctabtn1.btnText}
                            <FaArrowRightLong/>
                        </div>
                    </CTAbutton>

                    <CTAbutton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                            {ctabtn2.btnText}
                    </CTAbutton>
                </div>

            </div>


            {/* ************************* Section-2 {HTML Code-editor} ************** */}

            <div className=" relative h-fit flex border border-richblack-100 flex-row  w-[100%] py-4 lg:w-[500px]">
                <div className={`codeblock1 absolute ${backgroundGradient}  `}></div>
                <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>

                </div>

                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                    <TypeAnimation 
                    sequence={[codeblock, 1000, ""]} 
                    repeat={Infinity} cursor={true } 
                    style={
                        { whiteSpace:"pre-line",
                          display:"block"
                        }
                    }
                    omitDeletionAnimation={true}
                    />
                </div>
            </div>

            

        </div>
    )
}

export default CodeBlocks;