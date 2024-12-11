import {mongoose} from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [5, "Title must be at least 5 characters"],
        maxLength: [100, "Title cannot exceed 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [10, "Description must be at least 10 characters"],
        trim: true
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: [true, "Blog category is required"]
    },
    createdBy: {
        type: String,
        required: [true, "Author name is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog
