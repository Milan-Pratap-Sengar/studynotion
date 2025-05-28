import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination } from 'swiper/modules';

import Course_Card from "./Course_Card"





export default function CourseSlider({Courses}){
    console.log(Courses);
    return(
        <>
            {
                Courses.length ?
                (
                    <Swiper slidesPerView={1} spaceBetween={25} loop={true} modules={[FreeMode, Pagination]}  breakpoints={{1024: {slidesPerView: 3,},}} className="max-h-[30rem]">
                        {
                            Courses?.map((course,index)=>(
                                <SwiperSlide key={index}>
                                    <Course_Card course={course} height={"h-[250px]"}/>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                ):
                (
                    <div className="text-xl text-richblack-5">No Course Found</div>
                )
            }
        </>
    )
}
