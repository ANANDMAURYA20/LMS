import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    analysis: null,
    loading: false,
    error: null
};

export const getProgressAnalysis = createAsyncThunk(
    'progress/getAnalysis',
    async (_, { rejectWithValue }) => {
        try {
            // const loadingId = toast.loading("Analyzing your progress...");
            const response = await axiosInstance.get('/api/v1/ai/analyze-progress');
            toast.success("Analysis complete", { id: loadingId });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to analyze progress');
            return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
        }
    }
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProgressAnalysis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProgressAnalysis.fulfilled, (state, action) => {
                state.loading = false;
                state.analysis = action.payload.analysis;
            })
            .addCase(getProgressAnalysis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get analysis';
            });
    }
});

export default progressSlice.reducer;