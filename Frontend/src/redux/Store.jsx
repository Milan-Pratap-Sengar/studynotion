import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/Index'

// It is made up of slices..
export const store = configureStore({
  reducer: rootReducer,
})