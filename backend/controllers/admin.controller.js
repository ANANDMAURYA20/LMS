import Course from '../models/course.model.js';
import CourseRequest from '../models/courseRequest.model.js';
import LectureRequest from '../models/lectureRequest.model.js';
import AppError from '../utils/error.utils.js';

// Get all pending courses
export const getPendingCourses = async (req, res, next) => {
    try {
        const pendingCourses = await Course.find({ approvalStatus: 'PENDING' })
            .populate('instructor', 'name email')
            .select('title description category thumbnail createdBy createdAt');

        res.status(200).json({
            success: true,
            message: 'Pending courses fetched successfully',
            pendingCourses
        });
    } catch (error) {
        return next(new AppError('Failed to fetch pending courses', 500));
    }
};

// Get all pending lectures
export const getPendingLectures = async (req, res, next) => {
    try {
        const coursesWithPendingLectures = await Course.find({
            'lectures.approvalStatus': 'PENDING'
        }).populate('instructor', 'name email');

        // Format the response to only include relevant information
        const pendingLectures = coursesWithPendingLectures.map(course => {
            const pendingLecturesInCourse = course.lectures.filter(
                lecture => lecture.approvalStatus === 'PENDING'
            );

            return {
                courseId: course._id,
                courseTitle: course.title,
                instructor: course.instructor,
                pendingLectures: pendingLecturesInCourse.map(lecture => ({
                    lectureId: lecture._id,
                    title: lecture.title,
                    description: lecture.description,
                    createdAt: lecture.createdAt
                }))
            };
        });

        res.status(200).json({
            success: true,
            message: 'Pending lectures fetched successfully',
            pendingLectures
        });
    } catch (error) {
        return next(new AppError('Failed to fetch pending lectures', 500));
    }
};

// Approve or reject a course
export const updateCourseApprovalStatus = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return next(new AppError('Invalid approval status', 400));
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return next(new AppError('Rejection reason is required when rejecting a course', 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        course.approvalStatus = status;
        course.rejectionReason = status === 'REJECTED' ? rejectionReason : null;

        await course.save();

        res.status(200).json({
            success: true,
            message: `Course ${status.toLowerCase()} successfully`,
            course
        });
    } catch (error) {
        return next(new AppError(`Failed to ${req.body.status.toLowerCase()} course`, 500));
    }
};

// Approve or reject a lecture
export const updateLectureApprovalStatus = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return next(new AppError('Invalid approval status', 400));
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return next(new AppError('Rejection reason is required when rejecting a lecture', 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lecture = course.lectures.id(lectureId);

        if (!lecture) {
            return next(new AppError('Lecture not found', 404));
        }

        lecture.approvalStatus = status;
        lecture.rejectionReason = status === 'REJECTED' ? rejectionReason : null;

        await course.save();

        res.status(200).json({
            success: true,
            message: `Lecture ${status.toLowerCase()} successfully`,
            lecture
        });
    } catch (error) {
        return next(new AppError(`Failed to ${req.body.status.toLowerCase()} lecture`, 500));
    }
};

// Get course approval status for instructor
export const getCourseApprovalStatus = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .select('approvalStatus rejectionReason');

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            approvalStatus: course.approvalStatus,
            rejectionReason: course.rejectionReason
        });
    } catch (error) {
        return next(new AppError('Failed to fetch course approval status', 500));
    }
};

// Get lecture approval status for instructor
export const getLectureApprovalStatus = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lecture = course.lectures.id(lectureId);

        if (!lecture) {
            return next(new AppError('Lecture not found', 404));
        }

        res.status(200).json({
            success: true,
            approvalStatus: lecture.approvalStatus,
            rejectionReason: lecture.rejectionReason
        });
    } catch (error) {
        return next(new AppError('Failed to fetch lecture approval status', 500));
    }
};

// Get all pending course requests
export const getPendingCourseRequests = async (req, res, next) => {
    try {
        const pendingRequests = await CourseRequest.find({ status: 'PENDING' })
            .populate('instructor', 'name email')
            .select('title description category thumbnail createdAt');

        res.status(200).json({
            success: true,
            message: 'Pending course requests fetched successfully',
            pendingRequests
        });
    } catch (error) {
        return next(new AppError('Failed to fetch pending course requests', 500));
    }
};

// Get all pending lecture requests
export const getPendingLectureRequests = async (req, res, next) => {
    try {
        const pendingRequests = await LectureRequest.find({ status: 'PENDING' })
            .populate('instructor', 'name email')
            .populate('courseId', 'title');

        res.status(200).json({
            success: true,
            message: 'Pending lecture requests fetched successfully',
            pendingRequests
        });
    } catch (error) {
        return next(new AppError('Failed to fetch pending lecture requests', 500));
    }
};

// Handle course request approval/rejection
export const handleCourseRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return next(new AppError('Rejection reason is required', 400));
        }

        const request = await CourseRequest.findById(requestId)
            .populate('instructor', 'name');

        if (!request) {
            return next(new AppError('Course request not found', 404));
        }

        // Update request status
        request.status = status;
        if (status === 'REJECTED') {
            request.rejectionReason = rejectionReason;
        }
        await request.save();

        if (status === 'APPROVED') {
            // Create new course
            const course = await Course.create({
                title: request.title,
                description: request.description,
                category: request.category,
                thumbnail: request.thumbnail,
                instructor: request.instructor._id,
                createdBy: request.instructor.name,
                approvalStatus: 'APPROVED',
                lectures: [], // Initialize empty lectures array
                numberOfLectures: 0,
                createdAt: new Date()
            });

            return res.status(200).json({
                success: true,
                message: 'Course request approved and course created successfully',
                course
            });
        }

        res.status(200).json({
            success: true,
            message: `Course request ${status.toLowerCase()} successfully`,
            request
        });
    } catch (error) {
        return next(new AppError(`Failed to handle course request: ${error.message}`, 500));
    }
};

// Handle lecture request approval/rejection
export const handleLectureRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return next(new AppError('Rejection reason is required', 400));
        }

        const request = await LectureRequest.findById(requestId)
            .populate('courseId')
            .populate('instructor', 'name');

        if (!request) {
            return next(new AppError('Lecture request not found', 404));
        }

        // Update request status
        request.status = status;
        if (status === 'REJECTED') {
            request.rejectionReason = rejectionReason;
        }
        await request.save();

        if (status === 'APPROVED') {
            const course = await Course.findById(request.courseId);
            
            if (!course) {
                return next(new AppError('Associated course not found', 404));
            }

            // Add lecture to course
            course.lectures.push({
                title: request.title,
                description: request.description,
                lecture: request.lecture,
                materials: request.materials,
                questions: request.questions,
                approvalStatus: 'APPROVED',
                createdBy: request.instructor.name
            });

            course.numberOfLectures = course.lectures.length;
            await course.save();

            return res.status(200).json({
                success: true,
                message: 'Lecture request approved and lecture added successfully',
                lecture: course.lectures[course.lectures.length - 1]
            });
        }

        res.status(200).json({
            success: true,
            message: `Lecture request ${status.toLowerCase()} successfully`,
            request
        });
    } catch (error) {
        return next(new AppError(`Failed to handle lecture request: ${error.message}`, 500));
    }
};

// Get course request status for instructor
export const getCourseRequestStatus = async (req, res, next) => {
    try {
        const { requestId } = req.params;

        const request = await CourseRequest.findById(requestId)
            .select('status rejectionReason');

        if (!request) {
            return next(new AppError('Course request not found', 404));
        }

        res.status(200).json({
            success: true,
            status: request.status,
            rejectionReason: request.rejectionReason
        });
    } catch (error) {
        return next(new AppError('Failed to fetch course request status', 500));
    }
};

// Get lecture request status for instructor
export const getLectureRequestStatus = async (req, res, next) => {
    try {
        const { requestId } = req.params;

        const request = await LectureRequest.findById(requestId)
            .select('status rejectionReason');

        if (!request) {
            return next(new AppError('Lecture request not found', 404));
        }

        res.status(200).json({
            success: true,
            status: request.status,
            rejectionReason: request.rejectionReason
        });
    } catch (error) {
        return next(new AppError('Failed to fetch lecture request status', 500));
    }
}; 