import { Router } from 'express';
import { 
    submitCourseRequest,
    submitLectureRequest,
    getRequestStatus
} from '../controllers/request.controller.js';
import { authorisedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Debug middleware for this router
router.use((req, res, next) => {
    console.log(`[REQUEST ROUTES] ${req.method} ${req.baseUrl}${req.url}`);
    next();
});

// Protect all routes
router.use(isLoggedIn);

// Course request routes
router.post('/courses', 
    (req, res, next) => {
        console.log('[DEBUG] Course request received');
        next();
    },
    authorisedRoles('INSTRUCTOR'),
    upload.single('thumbnail'),
    submitCourseRequest
);

// Lecture request routes
router.post('/lectures', 
    (req, res, next) => {
        console.log('[DEBUG] Lecture request received');
        next();
    },
    authorisedRoles('INSTRUCTOR'),
    upload.fields([
        { name: 'lecture', maxCount: 1 },
        { name: 'materials', maxCount: 1 }
    ]),
    submitLectureRequest
);

// Status check routes
router.get('/:type/:requestId/status',
    (req, res, next) => {
        console.log('[DEBUG] Status check request received');
        next();
    },
    authorisedRoles('INSTRUCTOR'),
    getRequestStatus
);

// Debug route to verify the router is working
router.get('/test', (req, res) => {
    console.log('[DEBUG] Test route hit');
    res.json({ message: 'Request routes are working' });
});

export default router; 