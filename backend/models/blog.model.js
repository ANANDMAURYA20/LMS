import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        trim: true,
    },
    link:{
        type: String,
        required: [true, 'Link is required'],
        trim: true,
    },
    imageUrl: { 
        type: String, 
        required: [true, 'Image URL is required']
    },
    thumbnail: {
        public_id: String,
        secure_url: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;