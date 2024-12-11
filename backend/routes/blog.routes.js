import { Router } from 'express';
import { createBlog, deleteBlog, getAllBlogs } from '../controllers/blog.controller.js';

const router = Router();

router.route('/create').post(createBlog);
router.route('/:id').delete(deleteBlog);

export default router;
