import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux";
import { ContactUS } from "../../services/operations/ContactUsAPI";
import CountryCode from "../../data/countrycode.json"



// Here, We will use a hook called as "React use-Form hook" which is imported from "React-hook-form" library...By using this hook, we dont need to perform state management, error handling, validation. All these actions will be handled by this hook automatically.


// if you are creating a form without "use-form-hook" , then- 
//      you need to take a variable which stores an object that contains firstname,lastname,email etc... {example :- const[formData,setFormData]=useState({firstname:"",lastname:"",email:""})}
//      In each input tag, you need to apply onchange handler to update the latest values of each input field. {example :- function(event) => {event.target.name=event.target.value}}
//      you need to use "value" attribute in each input field to store the value of that input varible

// but by using "use-form hook", all these things automatically handled by this hook itself


//  EXPLAINATION

// {...register("firstname",{required:true})} : It will automatically register/store the value of that input tag in "firstname" variable.
// handleSubmit :-  It handles the form submission. Before calling your function to send the form data, it checks if the form is valid (i.e., if all required fields are filled out correctly).
// reset :- It clears or resets all the form fields, usually after the form is submitted successfully.
// errors:- If there are any problems with the form (like missing required fields), this will tell you what went wrong.
// isSubmitSuccessful:-  This tells you if the form was successfully submitted. You can use it to show a success message or reset the form after submission



function ContactUsForm(){

    const [loading,setLoading]=useState(false)
    const {register, handleSubmit, reset, formState:{errors, isSubmitSuccessful}}=useForm();  // all of these are built-in functions of this hook
    const dispatch=useDispatch();


    // it will reset all the data once after the form is submitted successfully
    useEffect( () => {
        if(isSubmitSuccessful){
            reset(
                {
                    email:"",
                    firstname:"",
                    lastname:"",
                    message:"",
                    phoneNo:""
                }
            )
        }
    },[reset, isSubmitSuccessful])

    function submitContactForm( data){
        dispatch(ContactUS(data,setLoading))
    }

    return (
        <form onSubmit={handleSubmit(submitContactForm)}>

            <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                    {/* firstName */}
                    <div className="flex flex-col w-[45%]">
                        <label htmlFor="firstname" className="text-white mb-2">FirstName</label>
                        <input  id="firstname" lassName='text-black' type="text" name="firstName" placeholder="Enter Your FirstName" {...register("firstname",{required:true})} className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                        {
                            errors.firstname && (
                                <span>
                                    Please enter your Name
                                </span>
                            )
                        }                        
                    </div>

                    {/* LastName */}
                    <div className="flex flex-col w-[45%]">
                        <label className="text-white mb-2" htmlFor="lastname">LastName</label>
                        <input id="lastname"  type="text" name="lastName" placeholder="Enter Your LastName" {...register("lastName")} className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                    </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col">
                        <label className="text-white mb-2" htmlFor="email">Email Address </label>
                        <input type="email" id="email" name="email" placeholder="Enter Email Address" {...register("email",{required:true})} className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                        {
                            errors.email && (
                                <span>
                                    Please enter your Email Address
                                </span>
                            )
                        }

                        
                </div>

                {/* phone number */}
                <div className="flex flex-col">
                    <label className="text-white mb-2" htmlFor="phonenumber"> Phone Number </label> 
                    <div className="flex flex-row gap-1 ">
                            <select name="dropdown" id="dropdown"  {...register("countrycode",{required:true})} className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-[15%] p-[12px] mr-5">
                                {
                                    CountryCode.map( (data,index)=>{
                                        return (
                                            <option key={index} value={data.code}>
                                                {data.code}-{data.country}
                                            </option>
                                        )
                                    } )
                                }
                            </select>

                            <input 
                                type="number"
                                id="phonenumber"
                                name="phonenumber"
                                placeholder="12345 67890"
                                className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"
                                {...register("phoneNo",
                                    {
                                        required:{value:"true", message:"Please Enter Phone Number"},
                                        maxLength:{value:10, message:"Invalid Phone Number"},
                                        minLength:{value:8, message:"Invalid Phone Number"}
                                    }
                                )}
                                
                            />

                    </div>
                    {
                        errors.phoneNo && (
                            <span>{errors.phoneNo.message}</span>
                        )
                    }
                            
                </div>

                {/* message */}
                <div className="flex flex-col">
                    <label className="text-white mb-2" htmlFor="message">Message</label>
                    <textarea id="message" name="message" cols="30" rows="7" placeholder="Enter Your Message here" {...register("message",{required:true})} className="bg-[#2C333F] rounded-[0.5rem] drop-shadow-[0_2px_rgba(255,255,255,0.5)] text-richblack-5 w-full p-[12px]"/>
                    {
                        errors.email && (
                            <span>
                                Please Enter Your Message
                            </span>
                        )
                    }
                </div> 

                <button type="submit" className="bg-yellow-50 rounded-[8px] font-bold text-richblack-900 px-[12px] py-[8px] mt-6">Send Message</button>
            </div>
            
        </form>
    )
}

export default ContactUsForm