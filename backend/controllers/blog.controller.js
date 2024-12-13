import Blog from '../models/blog.model.js';
import cloudinary from '../utils/cloudinary.utils.js';
import fs from 'fs/promises';
import AppError from '../utils/error.utils.js';

export const createBlog = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return next(new AppError("All fields are required", 400));
        }

        if (!req.file) {
            return next(new AppError("Thumbnail image is required", 400));
        }

        // Upload to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'lms/blogs',
            resource_type: 'image'
        });

        // Create blog with Cloudinary details
        const blog = await Blog.create({
            title,
            description,
            imageUrl: req.file.path,
            thumbnail: {
                public_id: cloudinaryResult.public_id,
                secure_url: cloudinaryResult.secure_url
            }
        });

        // Remove local file
        await fs.unlink(req.file.path);

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        // Remove local file in case of error
        if (req.file) await fs.unlink(req.file.path);
        return next(new AppError(error.message, 500));
    }
};

export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return next(new AppError("Blog not found", 404));
        }

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(blog.thumbnail.public_id);

        // Delete blog from database
        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return next(new AppError("Blog not found", 404));
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};