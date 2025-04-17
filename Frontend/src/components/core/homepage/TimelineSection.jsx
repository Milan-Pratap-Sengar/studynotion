import logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

function TimelineSection(){

    const timeline= [
        {
            Logo: logo1,
            Heading: "Leadership",
            Description: "Fully committed to the success company"
        },
        {
            Logo: logo2,
            Heading: "Responsibility",
            Description: "Students will always be our top priority"
        },
        {
            Logo: logo3,
            Heading: "Flexibility",
            Description: "The ability to switch is an important skills"
        },
        {
            Logo: logo4,
            Heading: "Solve the problem",
            Description: "Code your way to a solution"
        },

    ]

    return(
        <div>
            <div className="flex flex-row gap-15 items-center justify-between">

                {/* **************Section-1 {Left container} **************** */}
                <div className="flex flex-col gap-5 w-[50%] -ml-11 mr-10">
                    {
                        timeline.map( (element,index)=>{
                            return (
                                <div className="flex flex-row gap-6" key={index}>
                                    <div className="w-[50px] h-[50px] bg-white flex items-center">
                                        <img src={element.Logo} alt="img"/>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-[18px]">{element.Heading}</h2>
                                        <p className="text-base">{element.Description}</p>
                                    </div>
                                </div>
                            )
                        } )
                    }
                </div>

                {/* ************* section-2 {Image container} */}
                <div className="relative shadow-blue-200 shadow-[0px_0px_30px_0px]">
                    <img src={timelineImage} alt="TimelineImage" className="shadow-white shadow-[20px_20px_0px_0px] h-[200px] object-cover lg:h-fit"/>

                    <div className="absolute left-[50%] translate-x-[-50%] translate-y-[-50%]  flex flex-row bg-caribbeangreen-700 text-white uppercase py-6">
                        <div className="flex flex-row items-center gap-5 border-r px-7 border-caribbeangreen-300 ">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-sm text-caribbeangreen-300 ">Years of Experience</p>
                        </div>
                        <div className="flex gap-5 items-center px-7 ">
                            <p className="text-3xl font-bold">250</p>
                            <p className="text-sm text-caribbeangreen-300 ">Types of Courses</p>
                        </div>
                    </div>
                </div>  

            </div>
        </div>
    )
}

export default TimelineSection;