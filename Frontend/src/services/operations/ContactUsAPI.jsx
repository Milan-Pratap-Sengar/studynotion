import toast from "react-hot-toast"
import {apiConnector} from "../apiConnector"
import { contactusEndpoint } from "../apis"


const {CONTACT_US_API}=contactusEndpoint

export function ContactUS(data,setLoading) {
    console.log("Logging Data ", data)
    return async (dispatch) => {
        try {
            setLoading(true)
            // const response = await apiConnector("POST",CONTACT_US_API, data)
            const response={status:"ok"};
            console.log("Logging RESPONSE............", response)
            setLoading(false)
            toast.success("Message Sent Successfully")
        }
        catch (error) {
            console.log("Message Sending ERROR............", error)
            toast.error("Failed To Send Message")
            setLoading(false)
        }
    }
}