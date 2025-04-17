// This will prevent authenticated users from accessing this route

import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({children}){
    const { token } = useSelector((state) => state.auth)

    console.log(token)

    // if Token is null, It means that user is not logged in. So, we need to display the login page.
    if (token === null) {
        return children
    }
    else {
        return <Navigate to="/dashboard/my-profile" />
    }
}

export default OpenRoute



