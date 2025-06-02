import {configureStore} from "@reduxjs/toolkit"
import AuthSliceReducer from "./Slices/AuthSlice"
import CourseSliceReducer from "./Slices/CourseSlice"
import RazorpaySliceReducer from "./Slices/RazorpaySlice"
import LectureSliceReducer from "./Slices/LectureSlice"
import StatSliceReducer from "./Slices/StatSlice"
import BlogReducer from './Slices/BlogSlice';
import scoreReducer from './Slices/ScoreSlice';
import progressReducer from './Slices/ProgressSlice';
import InstructorSliceReducer from './Slices/InstructorSlice';

 const store = configureStore({
    reducer: {
        auth: AuthSliceReducer,
        course: CourseSliceReducer,
        razorpay: RazorpaySliceReducer,
        lecture: LectureSliceReducer,
        stat: StatSliceReducer,
        blogs: BlogReducer,
        scores: scoreReducer,
        progress: progressReducer,
        instructor: InstructorSliceReducer
    },
    devTools: true
})

export default store

