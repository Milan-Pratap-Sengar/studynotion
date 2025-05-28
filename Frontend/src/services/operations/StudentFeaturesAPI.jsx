import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../redux/Slices/CourseSlice";
import { resetCart } from "../../redux/Slices/CartSlice";

const {COURSE_PAYMENT_API,COURSE_VERIFY_API ,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints

function loadScript(src){
    // This syntax is based on razorpay documentation
    return new Promise((resolve)=>{
        const script=document.createElement("script")
        script.src=src

        script.onload=()=>{
            resolve(true)
        }

        script.onerror=()=>{
            resolve(false)
        }

        document.body.appendChild(script)
    })
}

export async function buyCourse(token,courses,userDetails,dispatch,navigate){
    const toastId=toast.loading("Loading...")
    try{
        // load the script (this script is copy pasted from documentation)
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK failed to load")
            return
        }

        // initiate the order
        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,{courses},{Authorization: `Bearer ${token}`})
        console.log("ORDER RESPONSE SUCCESS API.......",orderResponse.data)

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        // options (take reference from documentation for syntax)
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) {
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token );
                //verifyPayment
                console .log("before verifypayment call")
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }

        // to open small razorpay window
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    }
    catch(error){
        console.log("PAYMENT API ERROR..............",error)
        toast.error("Could not make Payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        const res=await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{orderId:response.razorpay_order_id,paymentId:response.razorpay_payment_id,amount},{Authorization: `Bearer ${token}`})
        console.log("Send payment success email",res)
    }
    catch(err){
        console.log("PAYMENT SUCCESSFUL EMAIL ERROR",err)
    }
}

async function verifyPayment(bodyData,token,navigate,dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        console.log("starting of verifyPayment")
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {Authorization:`Bearer ${token}`,  })

         console.log("after response of verifyPayment")
        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        console.log("before navigate of verifyPayment")
        navigate("/dashboard/enrolled-courses");
        console.log("after navigate of verifyPayment")
        dispatch(resetCart());
        console.log("ending of verifyPayment")
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

