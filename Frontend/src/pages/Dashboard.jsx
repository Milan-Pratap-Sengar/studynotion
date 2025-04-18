import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";


function DashboardPage(){

    const {loading : authLoading} = useSelector ( (state) => state.auth )
    const {loading : profileLoading} = useSelector ( (state) => state.profile )

    if( authLoading || profileLoading){
        return (
            <div className="spinner"/>
        )
    }

    return (
        <div className="relative flex min-h-[calc(100vh-3.5 rem)]">
            <Sidebar/>
            <div className="h-[calc(100vh-3.5rem)] overflow-auto">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;