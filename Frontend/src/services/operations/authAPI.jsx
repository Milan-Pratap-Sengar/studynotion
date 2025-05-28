import toast from "react-hot-toast"
import { setToken,setLoading } from "../../redux/Slices/AuthSlice"
import {resetCart} from "../../redux/Slices/CartSlice"
import {setUser} from "../../redux/Slices/ProfileSlice" 
import {apiConnector} from "../apiConnector"
import { endpoints } from "../apis"



// how to call a controller(backend) from frontend
// Take an example of "Login":-
// when you click on submit button in loginform then it will dispatch a "Login" function which is stored in /services/operations/authAPI 
// now observe the login function this file: - it does not have its own logic, its just make a backend call with the help of apiConnector
//  format : const response= await apiConnector("API type a/c to the backend defined route"  , API URL written in frontend , input parameters for that controller(see in backend) )



// these functions are used to display the information/indication about the backend call(whether the backend call executes successfully or not). so that the successful or reject message will be displayed on UI
const {SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API,} = endpoints 

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            })
            console.log("SENDOTP API RESPONSE............", response)
            console.log(response.data.success)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        }
    
        catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}



export function signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate ) {
    console.log("The data is ",accountType, firstName, lastName, email, password, confirmPassword, otp);
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })
            console.log("SIGNUP API RESPONSE............", response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        }

        catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            })
            console.log("LOGIN API RESPONSE............", response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Login Successful")
            dispatch(setToken(response.data.token))
            const userImage = response.data?.User?.image ? 
                              response.data.User.image : 
                              `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.User.firstName} ${response.data.User.lastName}`
            dispatch(setUser({ ...response.data.User, image: userImage }))
            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user", JSON.stringify(response.data.User))
            navigate("/dashboard/my-profile")
        }
        catch (error) {
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            })
            console.log("RESETPASSTOKEN RESPONSE............", response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Reset Email Sent")
            setEmailSent(true)
        }
        catch (error) {
            console.log("RESETPASSTOKEN ERROR............", error)
            toast.error("Failed To Send Reset Email")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function resetPassword(password, confirmPassword, token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            })
            console.log("RESETPASSWORD RESPONSE............", response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Password Reset Successfully")
            navigate("/login")
        }
        catch (error) {
            console.log("RESETPASSWORD ERROR............", error)
            toast.error("Failed To Reset Password")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}