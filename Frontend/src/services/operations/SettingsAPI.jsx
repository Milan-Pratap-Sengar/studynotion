
import toast from "react-hot-toast"
import { setUser } from "../../redux/Slices/ProfileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"





const { UPDATE_DISPLAY_PICTURE_API, UPDATE_PROFILE_API, CHANGE_PASSWORD_API, DELETE_PROFILE_API} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        formData.forEach((data)=>{
            console.log("display picture",data)
        })
        try {
            const response = await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`} )
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response )

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const userImage = response.data.data.image ? response.data.data.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            console.log(userImage)
            dispatch( setUser({ ...response.data.data, image: userImage }) )
            toast.success("Display Picture Updated Successfully")

        }
        catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {Authorization: `Bearer ${token}`,})
            console.log("UPDATE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const userImage = response.data.updatedUserDetails.image ? response.data.updatedUserDetails.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            const about=response.data.updatedUserDetails.additionalDetails.about
            const dob=response.data.updatedUserDetails.additionalDetails.dateOfBirth
            const contact=response.data.updatedUserDetails.additionalDetails.contactNumber
            const gender=response.data.updatedUserDetails.additionalDetails.gender
            // console.log(about,dob,contact,gender)
            dispatch( setUser({ ...response.data.updatedUserDetails, image:userImage}) )
            toast.success("Profile Updated Successfully")
        }
        catch (error) {
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        toast.dismiss(toastId)
    }
}

export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, { Authorization: `Bearer ${token}`, })
        console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Password Changed Successfully")
    }
    catch (error) {
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, { Authorization: `Bearer ${token}`, })
            console.log("DELETE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Profile Deleted Successfully")
            dispatch(logout(navigate))
        }
        catch (error) {
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}