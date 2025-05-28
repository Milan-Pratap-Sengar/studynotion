import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";


function DashboardPage(){

    const {loading : authLoading} = useSelector ( (state) => state.auth )
    const {loading : profileLoading} = useSelector ( (state) => state.profile )

    if( authLoading || profileLoading){
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
              <div className="spinner"></div>
            </div>
          )
    }

    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <Sidebar/>
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    {/* Outlet is a special component in React Router DOM that acts as a placeholder for rendering child routes inside a parent route."
                        Imagine you have a parent route called /dashboard and inside it, you want nested routes like /dashboard/profile and /dashboard/settings. Outlet is used in the parent to display these child components.
                    */}
                    <Outlet/> 
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;