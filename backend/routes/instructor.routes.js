import { Router } from "express";
import { isLoggedIn, authorisedRoles } from "../middleware/auth.middleware.js";
import { 
    getInstructorCourses, 
    getInstructorStats, 
    createCourseRequest,
    getInstructorCourseRequests
} from '../controllers/instructor.controller.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

// Course request routes
router.route('/course-requests')
    .post(
        isLoggedIn, 
        authorisedRoles('INSTRUCTOR'), 
        upload.single('thumbnail'),
        createCourseRequest
    )
    .get(
        isLoggedIn, 
        authorisedRoles('INSTRUCTOR'), 
        getInstructorCourseRequests
    );

// Get all courses created by the instructor
router.route('/courses')
    .get(isLoggedIn, authorisedRoles('INSTRUCTOR', 'ADMIN'), getInstructorCourses);

// Get instructor's statistics
router.route('/stats')
    .get(isLoggedIn, authorisedRoles('INSTRUCTOR', 'ADMIN'), getInstructorStats);

export default router;