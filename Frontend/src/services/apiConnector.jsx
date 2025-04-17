import axios from "axios";


// axios.create({}): This creates a new Axios instance with custom configurations (like baseURL, headers, timeout, etc.).
                    // In your example, it's empty ({}), so it's currently using default settings.
// Even if you're not passing options right now, it prepares your code for scalability.

export const axiosInstance= axios.create({});


// It is a user-defined callback function which is used to make api calls.

export const apiConnector=(method,url,bodyData,headers,params)=>{
    return axiosInstance({
        method:`${method}`, //The HTTP method ("GET", "POST", "PUT", etc.)
        url:`${url}`, //The endpoint URL (e.g., /login, /signup)
        data : bodyData ? bodyData : null,    //The request body (for POST/PUT/PATCH requests)
        headers : headers ? headers : null,   // Optional headers (e.g., Authorization tokens)
        params : params ? params  : null      // Optional query parameters (e.g., ?page=1&limit=10)
    })
}