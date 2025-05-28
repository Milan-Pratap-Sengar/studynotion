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
import Settings from "./components/core/Dashboard/settings/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/cart/Cart";
import { ACCOUNT_TYPE } from "./utils/Constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse"
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";


function App() {


  const { user } = useSelector((state) => state.profile)


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="catalog/:catalogName" element={<Catalog/>}/>
        <Route path="courses/:courseId" element={<CourseDetails/>}/>
        <Route path="signup" element={<OpenRoute><SignupPage/></OpenRoute>}/>
        <Route path="login" element={<OpenRoute><LoginPage/></OpenRoute>}/>
        <Route path="forgot-Password" element={<OpenRoute><ForgetPassword/></OpenRoute>}/>
        <Route path="update-password/:id" element={<OpenRoute><ChangePassword/></OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>}/>
        <Route path="about" element={<AboutPage/>}/>
        <Route path="contact" element={<ContactUsPage/>}/>
        <Route element={ <PrivateRoute><DashboardPage/></PrivateRoute>}> {/* Here, we don't write any path because Dashboard component does not contain its own data and dont have its own path..dashboard sometimes contains my-profile page,setting page, enrolloed courses page whose path already written and many more components  */}
          <Route path="dashboard/my-profile" element={<PrivateRoute><MyProfile/></PrivateRoute>}/>
          <Route path="dashboard/settings" element={<Settings/>}/>
          
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
                <Route path="dashboard/cart" element={<Cart/>}/>
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            </>
            )
          }
        </Route>
        

        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  )
}

export default App;

// http://localhost:3000/courses/6836958b5db3379ada0478fb
