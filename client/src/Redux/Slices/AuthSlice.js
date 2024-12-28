import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from '../../Helpers/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {}
}

// .....signup.........
export const createAccount = createAsyncThunk("/api/v1/user/register", async (data) => {
    const loadingMessage = toast.loading("Please wait! creating your account...");
    try {
        const res = await axiosInstance.post("/api/v1/user/register", data);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

export const verifyEmail = createAsyncThunk(
    "/api/v1/user/verify-email",
    async (token) => {
        const loadingMessage = toast.loading("Verifying email...");
        try {
            const res = await axiosInstance.post(`/api/v1/user/verify-email/${token}`);
            toast.success(res?.data?.message, { id: loadingMessage });
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, { id: loadingMessage });
            throw error;
        }
    }
);

export const resendVerificationEmail = createAsyncThunk(
    "/api/v1/user/resend-verification",
    async (email) => {
        const loadingMessage = toast.loading("Sending verification email...");
        try {
            const res = await axiosInstance.post("/api/v1/user/resend-verification", { email });
            toast.success(res?.data?.message, { id: loadingMessage });
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, { id: loadingMessage });
            throw error;
        }
    }
);

// .....Login.........
export const login = createAsyncThunk("/api/v1/user/login", async (data) => {
    const loadingMessage = toast.loading("Please wait! logging into your account...");
    try {
        const res = await axiosInstance.post("/api/v1/user/login", data);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

// .....Logout.........
export const logout = createAsyncThunk("/api/v1/user/logout", async () => {
    const loadingMessage = toast.loading("logout...");
    try {
        const res = await axiosInstance.get("/api/v1/user/logout");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

// .....get user data.........
export const getUserData = createAsyncThunk("/auth/user/me", async () => {
    const loadingMessage = toast.loading("fetching profile...");
    try {
        const res = await axiosInstance.get("/user/me");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})


// .....update user data.........
export const updateUserData = createAsyncThunk("/api/v1/user/me", async (data) => {
    const loadingMessage = toast.loading("Updating changes...");
    try {
        const res = await axiosInstance.post(`/api/v1/user/update/${data.id}`, data.formData);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
})

// .....change user password.......
export const changePassword = createAsyncThunk(
    "/api/v1/user/changePassword",
    async (userPassword) => {
        const loadingMessage = toast.loading("Changing password...");
        try {
            const res = await axiosInstance.post("/api/v1/user/change-password", userPassword);
            toast.success(res?.data?.message, { id: loadingMessage });
            return res?.data
        } catch (error) {
            toast.error(error?.response?.data?.message, { id: loadingMessage });
            throw error;
        }
    }
);

// .....forget user password.....
export const forgetPassword = createAsyncThunk(
    "/api/v1/user/forgetPassword",
    async (email) => {
        const loadingMessage = toast.loading("Please Wait! sending email...");
        try {
            const res = await axiosInstance.post("/api/v1/user/reset", {email});
            toast.success(res?.data?.message, { id: loadingMessage });
            return res?.data
        } catch (error) {
            toast.error(error?.response?.data?.message, { id: loadingMessage });
            throw error;
        }
    }
);


// .......reset the user password......
export const resetPassword = createAsyncThunk("/api/v1/user/reset", async (data) => {
    const loadingMessage = toast.loading("Please Wait! reseting your password...");
    try {
        const res = await axiosInstance.post(`/api/v1/user/reset/${data.resetToken}`,
            { password: data.password }
        );
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
});

// .......get all users data......
export const getAllUsers = createAsyncThunk("/api/v1/user/getallusers", async () => {
    const loadingMessage = toast.loading("Fetching users data...");
    try {
        const res = await axiosInstance.get("/api/v1/user/getuser");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        throw error;
    }
});

// .......update user data by admin......
export const updateUserDataAdmin = createAsyncThunk(
    "/api/v1/user/updateUserByAdmin",
    async ({id, formData}) => {
        const loadingMessage = toast.loading("Updating user data...");
        try {
            const res = await axiosInstance.get(`/api/v1/user/updateuser?userId=${id}`, formData);
            console.log(res)
            toast.success(res?.data?.message, { id: loadingMessage });
            return res?.data;
        } catch (error) {
            toast.error(error?.response?.data?.message, { id: loadingMessage });
            throw error;
        }
    }
);



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // for signup
        builder.addCase(createAccount.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("role", action?.payload?.user?.role);
            localStorage.setItem("isLoggedIn", true);
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
            state.isLoggedIn = true;
        })

        // for login
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("role", action?.payload?.user?.role);
            localStorage.setItem("isLoggedIn", true);
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
            state.isLoggedIn = true;
        })

        // for logout
        builder.addCase(logout.fulfilled, (state, action) => {
            localStorage.removeItem("data");
            localStorage.removeItem("role");
            localStorage.removeItem("isLoggedIn");
            state.data = {};
            state.role = "";
            state.isLoggedIn = false;
        })

        // for get user data
        builder.addCase(getUserData.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("role", action?.payload?.user?.role);
            localStorage.setItem("isLoggedIn", true);
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
            state.isLoggedIn = true;
        })
    }
})

export const { } = authSlice.actions;
export default authSlice.reducer;