import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../Helpers/axiosInstance";
export const addBlog = createAsyncThunk("/api/v1/blog/create", async (blogData) => {
  const response = await axiosInstance.post("/api/v1/blog/create", {
    method: "POST",
    body: blogData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Could not add blog");
  return data;
});

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
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
        state.error = action.error.message;
      });
  },
});

export default blogSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../Helpers/axiosInstance';

// const initialState = {
//     blogs: [],
//     loading: false,
//     error: null
// };

// // Create a new blog
// export const createBlog = createAsyncThunk(
//     'blog/createBlog',
//     async (formData) => {
//         try {
//             const response = await axiosInstance.post('/blog/create', formData);
//             return response.data;
//         } catch (error) {
//             throw error.response.data.message;
//         }
//     }
// );

// // Get all blogs
// export const getAllBlogs = createAsyncThunk(
//     'blog/getAllBlogs',
//     async () => {
//         try {
//             const response = await axiosInstance.get('/blog/all');
//             return response.data;
//         } catch (error) {
//             throw error.response.data.message;
//         }
//     }
// );

// // Delete a blog
// export const deleteBlog = createAsyncThunk(
//     'blog/deleteBlog',
//     async (id) => {
//         try {
//             const response = await axiosInstance.delete(`/blog/${id}`);
//             return response.data;
//         } catch (error) {
//             throw error.response.data.message;
//         }
//     }
// );

// const blogSlice = createSlice({
//     name: 'blog',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // Create blog
//             .addCase(createBlog.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createBlog.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.blogs.push(action.payload.blog);
//             })
//             .addCase(createBlog.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })

//             // Get all blogs
//             .addCase(getAllBlogs.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(getAllBlogs.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.blogs = action.payload.blogs;
//             })
//             .addCase(getAllBlogs.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })

//             // Delete blog
//             .addCase(deleteBlog.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deleteBlog.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.blogs = state.blogs.filter(blog => blog._id !== action.payload.id);
//             })
//             .addCase(deleteBlog.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     }
// });

// export default blogSlice.reducer;
