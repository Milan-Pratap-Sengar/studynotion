import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import CourseSubSectionAccordion from "./CourseSubsectionAccordian"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
    console.log( course, isActive, handleActive )

    const contentEl = useRef(null)
    console.log(contentEl)
    // Accordian state (Accordian means a div which can open and close)
    const [active, setActive] = useState(false)

    useEffect(() => {
        setActive(isActive?.includes(course._id))
    }, [isActive])


    const [sectionHeight, setSectionHeight] = useState(0)


// When active is true, you're measuring the scrollHeight(scrollHeight:full height of content, including overflow).
// When active is false, you're setting it to 0 to collapse it.
    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0)
    }, [active])

    

    return (
        <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">

            {/* section div */}
            <div>
                <div className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-6 transition-[0.3s]`}onClick={() => { handleActive(course._id)}}>
                    <div className="flex items-center gap-2">
                        <i className={isActive.includes(course._id) ? "rotate-180" : "rotate-0"}>
                            <AiOutlineDown />
                        </i>
                        <p>{course?.sectionName}</p>
                    </div>
                    <div className="space-x-4">
                        <span className="text-yellow-25">
                            {`${course.subsection.length || 0} lecture(s)`}
                        </span>
                    </div>
                </div>
            </div>
            <div
                ref={contentEl}
                // h-0 overflow-hidden : means when this div collapse, its inside data will be comes out of this div...hence we will hide the overflow data
                className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
                style={{
                    height: sectionHeight,
                }}
            >
                <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
                    {course?.subsection?.map((subSec, i) => {
                        return <CourseSubSectionAccordion subSec={subSec} key={i} />
                    })}
                </div>
            </div>
        </div>
    )
}