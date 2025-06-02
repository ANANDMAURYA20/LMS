import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    scores: [],
    userScores: [],
    loading: false,
    error: null
};

export const saveScore = createAsyncThunk(
    'scores/saveScore',
    async (scoreData) => {
        try {
            const response = await axiosInstance.post('/api/v1/scores', scoreData);
            toast.success('Score saved successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save score');
            throw error;
        }
    }
);

export const getAllScores = createAsyncThunk(
    'scores/getAllScores',
    async () => {
        try {
            console.log('Fetching all scores...'); // Debug log
            const response = await axiosInstance.get('/api/v1/scores/all');
            console.log('Scores response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching scores:', error); // Debug log
            toast.error(error.response?.data?.message || 'Failed to fetch scores');
            throw error;
        }
    }
);

export const getUserScores = createAsyncThunk(
    'scores/getUserScores',
    async (userId) => {
        try {
            const response = await axiosInstance.get(`/api/v1/scores/user/${userId || ''}`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch user scores');
            throw error;
        }
    }
);

const scoreSlice = createSlice({
    name: 'scores',
    initialState,
    reducers: {
        clearScores: (state) => {
            state.scores = [];
            state.userScores = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllScores.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllScores.fulfilled, (state, action) => {
                state.loading = false;
                state.scores = action.payload.scores;
                state.error = null;
            })
            .addCase(getAllScores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getUserScores.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserScores.fulfilled, (state, action) => {
                state.loading = false;
                state.userScores = action.payload.scores;
                state.error = null;
            })
            .addCase(getUserScores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearScores } = scoreSlice.actions;
export default scoreSlice.reducer;

