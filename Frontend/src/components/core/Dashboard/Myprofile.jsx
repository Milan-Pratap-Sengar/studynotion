import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import Login from "../../../pages/Login";



function MyProfile(){

    const {user}=useSelector( (state) => state.profile)
    const navigate=useNavigate()


    return (
        <div className="text-white">
            <h1>My Profile</h1>

            {/* ********** Section-1 ***********  */}
            <div>

                <div>
                    <img src={user?.image} alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover"/>
                    <div>
                        <p>{user?.firstName + " " + user?.lastName}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <IconBtn text={"Edit"} onClick={() => navigate("/dashboard/settings")}/>
            </div>
        </div>
    )
}

export default MyProfile;