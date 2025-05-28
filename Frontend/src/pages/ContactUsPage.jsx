import { IoChatboxEllipses } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { BsGlobeAmericas } from "react-icons/bs";
import Footer from "../components/common/Footer";
import ContactUsForm from "../components/common/ContactUsForm";



function ContactUsPage(){

    const array=[
        {
            heading:"Chat on us",
            p1:"Our friendly team is here to help.",
            p2:"milanpratap1407@gmail.com"
        },
        {
            heading:"Visit us",
            p1:"Come and say hello at our office HQ.",
            p2:"Haivatpur Road, Sirsaganj, Firozabad-283151"
        },
        {
            heading:"Call us",
            p1:"Mon - Fri From 8am to 5pm",
            p2:"6397697079"
        }
    ]

    return (
        <div>
            <div className=" mx-auto  mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row mb-40" >

                {/* left box */}
                <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6 h-[20%]">
                    {
                        array.map( (data,index) => {
                            return (
                                <div key={index} className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200" >
                                    <div className="flex flex-row items-center gap-3">
                                        {
                                            index==0 && <IoChatboxEllipses className="text-[160%]"/>
                                        }
                                        {
                                            index==1 && (<BsGlobeAmericas  className="text-[160%]"/>)

                                        }
                                        {
                                            index==2 && (<IoCall  className="text-[160%]"/>)

                                        }
                                        <h1 className="text-lg font-semibold text-richblack-5">{data.heading}</h1>
                                    </div>
                                    <p className="font-medium">{data.p1}</p>
                                    <p className="font-semibold">{data.p2}</p>
                                </div>
                            )
                        })
                    }
                </div>

                    {/* right box */}
                <div className="lg:w-[60%]">
                    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
                        <h1 className="text-4xl leading-10 font-semibold text-richblack-5">Got a Idea? We've got the skills. Let's team up</h1>
                        <p>Tell us more about yourself and what you're got in mind.</p>
                        <div className="mt-7">
                            <ContactUsForm/>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default ContactUsPage;