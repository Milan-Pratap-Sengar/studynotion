
// NOTE :: These endpoints must be according to your backend API routes
            // Example : suppose your backend route is "/auth/sendotp" and here you are writing "/auth/sendOTP" , then it will give you 404 not found error

// NOTE :- Our Backend is hosted on Windows server, thats why it treats these URLs as case-insensitive in this file...Otherwise they are case sensitive...So they should exactly matched with your backend routes

// Explaination of URLs:-
// take an example of "SendOtp" URL:-
// In our backend:- our route is router.post("/sendOtp")
// In server.js(Backend) file, this URL is mounted with "/api/v1";
// And our localhost URL is : "http://localhost:4000";
// So for backend, Our final URL is : "http://localhost:4000/api/v1/sendOtp"
// Hence, Our frontend URL should also same.
// In React(.env) file, Our REACT_BASE_URL is "http://localhost:4000/api/v1"
// And Rest of the part of the URL is appended in every Endpoint here

// NOTE: if you sendOtp from frontend, then ("http://localhost:4000/api/v1/sendOtp") this URL is not displayed in the web browser...It is just for backend connection.So it should be same as backend Url/route.
        // The URL which is displayed on the web browser is written in app.jsx file in Src folder...("http://localhost:4000/signup")



// Problems in these URLs
// differences in names : deleteAccount, verifySignature, 
// missing in this File: - create category, getAverageRating
// missing routes in backend :- sendPaymentSuccessEmail, editCourse, getInstructorCourses, deleteCourse, getFullCourseDetails, updateCourseProgress, reach/contact





const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendOtp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}
  
// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API: BASE_URL + "/payment/verifySignature",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
    GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
    COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    CREATE_SECTION_API: BASE_URL + "/course/addSection",
    CREATE_SUBSECTION_API: BASE_URL + "/course/addSubsection",
    UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
    UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubsection",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
    DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubsection",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getFullCourseDetails",
    LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
    CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
    CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
}
