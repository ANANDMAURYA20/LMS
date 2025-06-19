import CourseRequest from '../models/courseRequest.model.js';
import LectureRequest from '../models/lectureRequest.model.js';
import AppError from '../utils/error.utils.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

// Configure cloudinary
cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Submit a course request
export const submitCourseRequest = async (req, res, next) => {
    try {
        console.log('[DEBUG] Request headers:', req.headers);
        console.log('[DEBUG] Request user:', req.user);
        console.log('[DEBUG] Request body:', req.body);
        console.log('[DEBUG] Request file:', req.file);

        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return next(new AppError('All fields are required', 400));
        }

        // Check if user exists in request
        if (!req.user || !req.user._id) {
            console.log('[DEBUG] Authentication failed - no user in request');
            return next(new AppError('User not authenticated', 401));
        }

        const request = {
            title,
            description,
            category,
            instructor: req.user._id
        };

        // Handle thumbnail upload
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms/courses'
                });

                request.thumbnail = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };

                // Remove file from server
                await fs.unlink(req.file.path);
            } catch (error) {
                return next(new AppError('Failed to upload thumbnail', 500));
            }
        }

        const courseRequest = await CourseRequest.create(request);

        res.status(201).json({
            success: true,
            message: 'Course request submitted successfully',
            courseRequest
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Submit a lecture request
export const submitLectureRequest = async (req, res, next) => {
    try {
        const { title, description, courseId, questions } = req.body;

        if (!title || !description || !courseId) {
            return next(new AppError('All fields are required', 400));
        }

        // Check if user exists in request
        if (!req.user || !req.user._id) {
            return next(new AppError('User not authenticated', 401));
        }

        const request = {
            title,
            description,
            courseId,
            instructor: req.user._id,
            questions: questions ? JSON.parse(questions) : []
        };

        // Handle lecture video upload
        if (req.files && req.files.lecture && req.files.lecture[0]) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files.lecture[0].path, {
                    folder: 'lms/lectures',
                    resource_type: 'video'
                });

                request.lecture = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };

                // Remove file from server
                await fs.unlink(req.files.lecture[0].path);
            } catch (error) {
                return next(new AppError('Failed to upload lecture video', 500));
            }
        }

        // Handle materials upload
        if (req.files && req.files.materials && req.files.materials[0]) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files.materials[0].path, {
                    folder: 'lms/materials'
                });

                request.materials = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };

                // Remove file from server
                await fs.unlink(req.files.materials[0].path);
            } catch (error) {
                return next(new AppError('Failed to upload materials', 500));
            }
        }

        const lectureRequest = await LectureRequest.create(request);

        res.status(201).json({
            success: true,
            message: 'Lecture request submitted successfully',
            lectureRequest
        });
    } catch (error) {
        console.error('Error in submitLectureRequest:', error);
        return next(new AppError(error.message, 500));
    }
};

// Get request status
export const getRequestStatus = async (req, res, next) => {
    try {
        const { requestId, type } = req.params;

        const Model = type === 'course' ? CourseRequest : LectureRequest;
        const request = await Model.findById(requestId)
            .select('status rejectionReason');

        if (!request) {
            return next(new AppError('Request not found', 404));
        }

        res.status(200).json({
            success: true,
            status: request.status,
            rejectionReason: request.rejectionReason
        });
    } catch (error) {
        return next(new AppError('Failed to fetch request status', 500));
    }
}; 