import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../Helpers/axiosInstance';

const initialState = {
    coursesData: [],
    currentCourse: null,
    loading: false,
    error: null
}

// ....get all courses....
export const getAllCourses = createAsyncThunk("/api/v1/courses/get", async () => {
    const loadingMessage = toast.loading("fetching courses...");
    try {
        const res = await axiosInstance.get("/api/v1/courses");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

// ....get course by id....
export const getCourseById = createAsyncThunk(
    "/api/v1/courses/get-by-id",
    async (id) => {
        const loadingMessage = toast.loading("Fetching course details...");
        try {
            const res = await axiosInstance.get(`/api/v1/courses/${id}`);
            toast.success("Course details fetched successfully", { id: loadingMessage });
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch course details", { id: loadingMessage });
            throw error;
        }
    }
);

// ....update course....
export const updateCourse = createAsyncThunk(
    "/api/v1/courses/update",
    async ({ id, formData }) => {
        const loadingMessage = toast.loading("Updating course...");
        try {
            const res = await axiosInstance.put(`/api/v1/courses/${id}`, formData);
            toast.success("Course updated successfully", { id: loadingMessage });
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update course", { id: loadingMessage });
            throw error;
        }
    }
);

// ....create course....
export const createNewCourse = createAsyncThunk("/api/v1/courses/create", async (data) => {
    const loadingMessage = toast.loading("Creating course...");
    try {
        const res = await axiosInstance.post("/api/v1/courses", data);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

// ....delete course......
export const deleteCourse = createAsyncThunk("/api/v1/courses/delete", async (id) => {
    const loadingId = toast.loading("deleting course ...")
    try {
        const response = await axiosInstance.delete(`/api/v1/courses/${id}`);
        toast.success("Courses deleted successfully", { id: loadingId });
        return response?.data
    } catch (error) {
        toast.error("Failed to delete course", { id: loadingId });
        throw error
    }
});

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // for get all courses
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            state.coursesData = action?.payload?.courses;
            state.loading = false;
            state.error = null;
        })

        // for get course by id
        builder.addCase(getCourseById.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getCourseById.fulfilled, (state, action) => {
            state.currentCourse = action?.payload?.course;
            state.loading = false;
            state.error = null;
        })
        builder.addCase(getCourseById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

        // for update course
        builder.addCase(updateCourse.fulfilled, (state, action) => {
            const updatedCourse = action?.payload?.course;
            state.coursesData = state.coursesData.map(course => 
                course._id === updatedCourse._id ? updatedCourse : course
            );
            state.currentCourse = updatedCourse;
            state.loading = false;
            state.error = null;
        })

        // for delete course
        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.coursesData = state.coursesData.filter(course => course._id !== action.payload.id);
            state.loading = false;
            state.error = null;
        })
    }
})

export default courseSlice.reducer;