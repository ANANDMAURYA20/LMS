import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../Helpers/axiosInstance";
import { toast } from "react-hot-toast";

// Add Blog Thunk
export const addBlog = createAsyncThunk(
  'blogs/addBlog', 
  async (blogData, { rejectWithValue }) => {
    try {
      console.log("Sending blog data:", ...blogData.entries());
      const response = await axiosInstance.post('/api/v1/blog/create', blogData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Blog creation error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || { message: "Blog creation failed" }
      );
    }
  }
);

// Get All Blogs Thunk
export const getAllBlogs = createAsyncThunk(
  "/api/v1/blog/all", 
  async () => {
    const loadingMessage = toast.loading("fetching blogs...");
    try {
      const res = await axiosInstance.get("/api/v1/blog/all");
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: loadingMessage });
      throw error;
    }
  }
);

// Delete Blog Thunk
export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (blogId, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Deleting blog...");
    try {
      const response = await axiosInstance.delete(`/api/v1/blog/${blogId}`);
      toast.success("Blog deleted successfully", { id: loadingMessage });
      return blogId;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete blog", { id: loadingMessage });
      return rejectWithValue(
        error.response?.data || { message: "Blog deletion failed" }
      );
    }
  }
);

// Get Blog By ID Thunk
export const getBlogById = createAsyncThunk(
  'blogs/getBlogById',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/blog/${blogId}`);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch blog details" }
      );
    }
  }
);

// Blog Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    currentBlog: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add Blog Cases
    builder
      .addCase(addBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });

    // Get All Blogs Cases
    builder.addCase(getAllBlogs.fulfilled, (state, action) => {
      state.blogs = action.payload.blogs;
      state.status = "succeeded";
    });

    // Delete Blog Cases
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        // Remove the deleted blog from the state
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });

    // Get Blog By ID Cases
    builder
      .addCase(getBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
        state.status = "succeeded";
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export default blogSlice.reducer;