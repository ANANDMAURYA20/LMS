import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slices/AuthSlice';
import courseSliceReducer from './Slices/CourseSlice';
import lectureSliceReducer from './Slices/LectureSlice';
import razorpaySliceReducer from './Slices/RazorpaySlice';
import statSliceReducer from './Slices/StatSlice';
import blogSliceReducer from './Slices/BlogSlice';
import scoreSliceReducer from './Slices/ScoreSlice';
import progressSliceReducer from './Slices/ProgressSlice';
import instructorSliceReducer from './Slices/InstructorSlice';

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer,
        blog: blogSliceReducer,
        scores: scoreSliceReducer,
        progress: progressSliceReducer,
        instructor: instructorSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: true
});

export default store; 