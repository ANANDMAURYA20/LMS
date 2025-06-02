import { Router } from "express";
import { isLoggedIn, authorisedRoles } from "../middleware/auth.middleware.js";
import { getInstructorCourses, getInstructorStats } from '../controllers/instructor.controller.js';

const router = Router();

// Get all courses created by the instructor
router.route('/courses')
    .get(isLoggedIn, authorisedRoles('INSTRUCTOR', 'ADMIN'), getInstructorCourses);

// Get instructor's statistics
router.route('/stats')
    .get(isLoggedIn, authorisedRoles('INSTRUCTOR', 'ADMIN'), getInstructorStats);

export default router;