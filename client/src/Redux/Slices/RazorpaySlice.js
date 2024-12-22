import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../Helpers/axiosInstance';

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

// ....get razorpay key id.....
export const getRazorPayId = createAsyncThunk("/api/v1/payments/keyId", async () => {
    try {
        const response = await axiosInstance.get("/api/v1/payments/razorpay-key");
        console.log(response)
        return response?.data;
    } catch (error) {
        console.error(error)
        toast.error("Failed to load data");
        throw error
    }
})

// ....purchase course bundle.....
export const purchaseCourseBundle = createAsyncThunk("/api/v1/payments/subscribe", async () => {
    try {
        const response = await axiosInstance.post("/api/v1/payments/subscribe");
        console.log(response.data)
        return response?.data;
    } catch (error) {
        console.error(error)
        toast.error(error?.response?.data?.message);
        throw error
    }
})

// ....verify payment.....
export const verifyUserPayment = createAsyncThunk("/api/v1/payments/verify", async (data) => {
    const loadingId = toast.loading("Subscribing bundle...");
    try {
        const response = await axiosInstance.post("/api/v1/payments/verify", data);
    console.log(response)
        toast.success("Payment verified", { id: loadingId });
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingId });
        throw error
    }
})

// .....get payment record......
export const getPaymentRecord = createAsyncThunk("/api/v1/payments/record", async () => {
    const loadingId = toast.loading("Getting the payment records");
    try {
        const response = await axiosInstance.get("/api/v1/payments?count=100");
        toast.success(response?.data?.message, {id: loadingId});
        return response?.data;
    } catch (error) {
        toast.error("Operation failed", {id: loadingId});
        throw error;
    }
});

// .....cancel subscription......
export const cancelCourseBundle = createAsyncThunk("/api/v1/payments/cancel", async () => {
    const loadingId = toast.loading("unsubscribing the bundle...")
    try {
        const response = await axiosInstance.post("/api/v1/payments/unsubscribe");
        toast.success(response?.data?.message, {id: loadingId});
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, {id: loadingId});
        throw error;
    }
})

const razoraySlice = createSlice({
    name: 'razorpay',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // for ge tRazorPay Api Key
        builder.addCase(getRazorPayId.fulfilled, (state, action) => {
            state.key = action?.payload?.key
        })

        // for purchase course bundle
        builder.addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id = action.payload?.subscription_id || null;
        })

        // for verify payment
        builder.addCase(verifyUserPayment.fulfilled, (state, action) => {
            state.isPaymentVerified = action?.payload?.success
        })

        // for getPaymentRecord
        builder.addCase(getPaymentRecord.fulfilled, (state, action) => {
            state.allPayments = action?.payload?.allPayments;
            state.finalMonths = action?.payload?.finalMonths;
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
        })
    }
})

export default razoraySlice.reducer;