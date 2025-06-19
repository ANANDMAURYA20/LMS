import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../Helpers/axiosInstance';

const initialState = {
    courses: [],
    stats: {
        totalCourses: 0,
        totalLectures: 0,
        totalStudents: 0,
        activeStudents: 0
    },
    loading: false,
    error: null
};

export const getInstructorCourses = createAsyncThunk(
    'instructor/getCourses',
    async () => {
        const loadingId = toast.loading('Fetching your courses...');
        try {
            const response = await axiosInstance.get('/api/v1/instructor/courses');
            console.log('Instructor courses response:', response.data); // Debug log
            toast.success(response?.data?.message, { id: loadingId });
            return response?.data;
        } catch (error) {
            console.error('Error fetching instructor courses:', error); // Debug log
            toast.error(error?.response?.data?.message || 'Failed to fetch courses', { id: loadingId });
            throw error;
        }
    }
);

export const getInstructorStats = createAsyncThunk(
    'instructor/getStats',
    async () => {
        const loadingId = toast.loading('Fetching statistics...');
        try {
            const response = await axiosInstance.get('/api/v1/instructor/stats');
            console.log('Instructor stats response:', response.data); // Debug log
            toast.success('Statistics fetched successfully', { id: loadingId });
            return response.data;
        } catch (error) {
            console.error('Error fetching instructor stats:', error); // Debug log
            toast.error(error?.response?.data?.message || 'Failed to fetch statistics', { id: loadingId });
            throw error;
        }
    }
);

const instructorSlice = createSlice({
    name: 'instructor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Instructor Courses
        builder
            .addCase(getInstructorCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInstructorCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                
                // Update course-specific stats
                let totalStudents = 0;
                let activeStudents = 0;
                
                action.payload.courses.forEach(course => {
                    totalStudents += course.totalEnrollments || 0;
                    activeStudents += course.activeStudents || 0;
                });
                
                state.stats = {
                    ...state.stats,
                    totalStudents,
                    activeStudents
                };
                
                state.error = null;
            })
            .addCase(getInstructorCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Get Instructor Stats
        builder.addCase(getInstructorStats.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getInstructorStats.fulfilled, (state, action) => {
            state.loading = false;
            state.stats = {
                ...state.stats,
                ...action.payload.stats
            };
            state.error = null;
        });
        builder.addCase(getInstructorStats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default instructorSlice.reducer; 