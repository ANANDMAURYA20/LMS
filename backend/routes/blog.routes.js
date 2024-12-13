import { Router } from 'express';
import { 
    createBlog, 
    deleteBlog, 
    getAllBlogs, 
    getBlogById 
} from '../controllers/blog.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router
    .route('/create')
    .post(upload.single('thumbnail'), createBlog);

router
    .route('/all')
    .get(getAllBlogs);

router
    .route('/:id')
    .get(getBlogById)
    .delete(deleteBlog);

export default router;