import courseModel from '../models/course.model.js';
import AppError from '../utils/error.utils.js';

// Get all courses created by the instructor
const getInstructorCourses = async (req, res, next) => {
    try {
        const instructorId = req.user.id;
        
        const courses = await courseModel.find({ instructor: instructorId }).select('-lectures');
        
        res.status(200).json({
            success: true,
            message: 'Instructor courses retrieved successfully',
            courses
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

export {
    getInstructorCourses
};