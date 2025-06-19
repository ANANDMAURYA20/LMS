import { Router } from 'express';
import { 
    getPendingCourses,
    getPendingLectures,
    updateCourseApprovalStatus,
    updateLectureApprovalStatus,
    getCourseApprovalStatus,
    getLectureApprovalStatus,
    getPendingCourseRequests,
    getPendingLectureRequests,
    handleCourseRequest,
    handleLectureRequest,
    getCourseRequestStatus,
    getLectureRequestStatus
} from '../controllers/admin.controller.js';
import { authorisedRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

// Admin only routes
router.use(isLoggedIn, authorisedRoles('ADMIN'));

// Course and lecture approval routes
router.get('/pending-courses', getPendingCourses);
router.get('/pending-lectures', getPendingLectures);
router.patch('/courses/:courseId/approval', updateCourseApprovalStatus);
router.patch('/courses/:courseId/lectures/:lectureId/approval', updateLectureApprovalStatus);

// Course and lecture request routes
router.get('/course-requests', getPendingCourseRequests);
router.get('/lecture-requests', getPendingLectureRequests);
router.patch('/course-requests/:requestId', handleCourseRequest);
router.patch('/lecture-requests/:requestId', handleLectureRequest);

// Status check routes (can be used by instructors too)
router.get('/courses/:courseId/approval-status', getCourseApprovalStatus);
router.get('/courses/:courseId/lectures/:lectureId/approval-status', getLectureApprovalStatus);
router.get('/course-requests/:requestId/status', getCourseRequestStatus);
router.get('/lecture-requests/:requestId/status', getLectureRequestStatus);

export default router; 