import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/StudentFeaturesAPI";


export default function CourseDetails(){

    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    const {courseId}=useParams()

    const handleBuyCourse=async()=>{
        if(token){
            buyCourse(token, [courseId],user,dispatch,navigate)
            return;
        }
    }



    return (
        <div className="flex items-center">
            <button className="bg-yellow-100" onClick={handleBuyCourse}>
                BUY NOW
            </button>
        </div>
    )
}