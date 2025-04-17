import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/AuthSlice"
import cartReducer from "../Slices/CartSlice"
import profileReducer from "../Slices/ProfileSlice"

// (not sure )you can write multiple reducers using this combineReducers() function. Generally, we use createSlice() function to create a slice and define reducers inside it.but here, we will make a seperate file
const rootReducer=combineReducers({
    auth: authReducer,
    profile : profileReducer,
    cart : cartReducer
    
})

export default rootReducer;