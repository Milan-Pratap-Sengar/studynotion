import ContactUsForm from "../../common/ContactUsForm";



function ContactFormSection(){
    return(
        <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
            <h1>Get in Touch</h1>
            <p>We'd love to here for you. Please fill out this form.</p>
            <div>
                <ContactUsForm/>
            </div>
        </div>
    )
}

export default ContactFormSection; 