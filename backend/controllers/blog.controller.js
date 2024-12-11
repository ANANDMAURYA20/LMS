import Blog from "../models/blog.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import AppError from "../utils/error.utils.js";

const createBlog = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;

        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }

        if (!req.file) {
            return next(new AppError("Thumbnail image is required", 400));
        }

        const blog = await Blog.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "dummy",
                secure_url: "dummy"
            }
        });

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms/blogs'
            });

            if (result) {
                blog.thumbnail.public_id = result.public_id;
                blog.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);

        } catch (error) {
            return next(new AppError("Error uploading thumbnail, please try again", 500));
        }

        await blog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return next(new AppError("Blog not found", 404));
        }

        // Delete image from cloudinary
        await cloudinary.v2.uploader.destroy(blog.thumbnail.public_id);

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            blogs
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


export {
    createBlog,
    deleteBlog,
    getAllBlogs
};
