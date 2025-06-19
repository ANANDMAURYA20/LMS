const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const {
    submitCourseRequest,
    submitLectureRequest,
    getPendingCourseRequests,
    getPendingLectureRequests,
    handleCourseRequest,
    handleLectureRequest
} = require('../controllers/requestController');

// Instructor routes
router.post('/course', 
    isAuthenticated, 
    authorizeRoles('INSTRUCTOR'), 
    submitCourseRequest
);

router.post('/lecture', 
    isAuthenticated, 
    authorizeRoles('INSTRUCTOR'), 
    submitLectureRequest
);

// Admin routes
router.get('/course/pending', 
    isAuthenticated, 
    authorizeRoles('ADMIN'), 
    getPendingCourseRequests
);

router.get('/lecture/pending', 
    isAuthenticated, 
    authorizeRoles('ADMIN'), 
    getPendingLectureRequests
);

router.put('/course/:requestId', 
    isAuthenticated, 
    authorizeRoles('ADMIN'), 
    handleCourseRequest
);

router.put('/lecture/:requestId', 
    isAuthenticated, 
    authorizeRoles('ADMIN'), 
    handleLectureRequest
);

module.exports = router;