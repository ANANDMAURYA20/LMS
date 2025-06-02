import Course from '../models/course.model.js';
import AppError from '../utils/error.utils.js';

// Get all courses created by the instructor
export const getInstructorCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        
        if (!courses || courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No courses found',
                courses: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Instructor courses fetched successfully',
            courses
        });
    } catch (error) {
        return next(new AppError('Failed to fetch instructor courses', 500));
    }
};

export const getInstructorStats = async (req, res, next) => {
    try {
        const totalCourses = await Course.countDocuments({ instructor: req.user.id });
        const courses = await Course.find({ instructor: req.user.id })
            .select('numberOfLectures');
        
        const totalLectures = courses.reduce((acc, course) => acc + course.numberOfLectures, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalCourses,
                totalLectures
            }
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};