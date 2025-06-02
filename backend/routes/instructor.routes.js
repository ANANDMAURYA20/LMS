import { Router } from "express";
const router = Router();
import { isLoggedIn, authorisedRoles } from "../middleware/auth.middleware.js";

// Import controller methods (to be created)
import { getInstructorCourses } from '../controllers/instructor.controller.js';

// Get all courses created by the instructor
router.get('/courses', isLoggedIn, authorisedRoles('INSTRUCTOR'), getInstructorCourses);

export default router;