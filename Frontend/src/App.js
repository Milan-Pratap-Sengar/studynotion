import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";
import VerifyEmail from "./pages/VerifyEmail";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import MyProfile from "./components/core/Dashboard/Myprofile";
import DashboardPage from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="signup" element={<OpenRoute><SignupPage/></OpenRoute>}/>
        <Route path="login" element={<OpenRoute><LoginPage/></OpenRoute>}/>
        <Route path="forgot-Password" element={<OpenRoute><ForgetPassword/></OpenRoute>}/>
        <Route path="update-password/:id" element={<OpenRoute><ChangePassword/></OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>}/>
        <Route path="about" element={<AboutPage/>}/>
        <Route path="contact" element={<ContactUsPage/>}/>
        <Route element={ <PrivateRoute><DashboardPage/></PrivateRoute>}>
          <Route path="dashboard/my-profile" element={<PrivateRoute><MyProfile/></PrivateRoute>}/>
        </Route>
        

        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  )
}

export default App;
